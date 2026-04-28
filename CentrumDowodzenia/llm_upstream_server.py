import json
import os
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib import error, request

HOST = "127.0.0.1"
PORT = 5000


def parse_analysis_json(text: str):
    if not text:
        return None

    cleaned = text.replace("```json", "").replace("```", "").strip()
    if cleaned.startswith("{"):
        try:
            parsed = json.loads(cleaned)
            if isinstance(parsed, dict) and parsed.get("temat") and parsed.get("wydarzenia"):
                return parsed
        except json.JSONDecodeError:
            pass

    start = cleaned.find("{")
    end = cleaned.rfind("}")
    if start != -1 and end != -1 and end > start:
        candidate = cleaned[start:end + 1]
        try:
            parsed = json.loads(candidate)
            if isinstance(parsed, dict) and parsed.get("temat") and parsed.get("wydarzenia"):
                return parsed
        except json.JSONDecodeError:
            return None

    return None


def call_openai_compatible(payload: dict):
    api_key = os.getenv("LLM_API_KEY", "").strip()
    if not api_key:
        raise RuntimeError("Brak LLM_API_KEY")

    base_url = os.getenv("LLM_API_BASE", "https://api.openai.com/v1").strip().rstrip("/")
    model = os.getenv("LLM_MODEL", "gpt-4.1-mini").strip()

    topic = str(payload.get("topic", "")).strip()
    mode = str(payload.get("mode", "quick")).strip().lower()
    system_prompt = str(payload.get("systemPrompt", "")).strip()
    if not system_prompt:
        system_prompt = "Odpowiadaj wylacznie poprawnym JSON-em."

    user_text = (
        f"Przeprowadz POGLEBIONA analize tematu: \"{topic}\". "
        "Szukaj wielu zrodel i pokaz korelacje."
        if mode == "deep"
        else f"Przeanalizuj temat: \"{topic}\". Zwracaj tylko JSON."
    )

    body = {
        "model": model,
        "temperature": 0.2,
        "response_format": {"type": "json_object"},
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_text},
        ],
    }

    req = request.Request(
        url=f"{base_url}/chat/completions",
        method="POST",
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        data=json.dumps(body).encode("utf-8"),
    )

    try:
        with request.urlopen(req, timeout=60) as resp:
            raw = resp.read().decode("utf-8")
    except error.HTTPError as http_err:
        details = http_err.read().decode("utf-8", errors="ignore")
        raise RuntimeError(f"HTTP {http_err.code}: {details[:300]}") from http_err
    except error.URLError as url_err:
        raise RuntimeError(f"Blad polaczenia: {url_err}") from url_err

    parsed_api = json.loads(raw)
    content = (
        parsed_api.get("choices", [{}])[0]
        .get("message", {})
        .get("content", "")
    )
    analysis = parse_analysis_json(content)
    if not analysis:
        raise RuntimeError("Model zwrocil odpowiedz, ale nie udalo sie sparsowac JSON analizy.")

    return {
        "analysis": analysis,
        "provider": "llm-upstream",
        "model": model,
    }


class LLMUpstreamHandler(BaseHTTPRequestHandler):
    def _send_json(self, payload, status=200):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        if self.path == "/health":
            self._send_json(
                {
                    "status": "ok",
                    "api_key_configured": bool(os.getenv("LLM_API_KEY", "").strip()),
                    "api_base": os.getenv("LLM_API_BASE", "https://api.openai.com/v1"),
                    "model": os.getenv("LLM_MODEL", "gpt-4.1-mini"),
                }
            )
            return
        self._send_json({"error": "Not found"}, status=404)

    def do_POST(self):
        if self.path != "/api/copilot-agent/analyze":
            self._send_json({"error": "Not found"}, status=404)
            return

        try:
            length = int(self.headers.get("Content-Length", "0"))
            raw = self.rfile.read(length) if length > 0 else b"{}"
            payload = json.loads(raw.decode("utf-8"))
        except (ValueError, json.JSONDecodeError):
            self._send_json({"error": "Niepoprawny JSON"}, status=400)
            return

        topic = str(payload.get("topic", "")).strip()
        if not topic:
            self._send_json({"error": "Pole 'topic' jest wymagane"}, status=400)
            return

        try:
            result = call_openai_compatible(payload)
            self._send_json(result, status=200)
        except RuntimeError as e:
            self._send_json({"error": str(e)}, status=502)


def main():
    server = HTTPServer((HOST, PORT), LLMUpstreamHandler)
    print(f"[OK] LLM Upstream: http://{HOST}:{PORT}")
    print("[INFO] Endpoint: POST /api/copilot-agent/analyze")
    print("[INFO] Health: GET /health")
    print("[INFO] Ustaw zmienne: LLM_API_KEY, LLM_API_BASE, LLM_MODEL")
    server.serve_forever()


if __name__ == "__main__":
    main()
