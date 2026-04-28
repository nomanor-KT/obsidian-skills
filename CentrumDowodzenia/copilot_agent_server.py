import json
import os
from datetime import datetime, timedelta
from http.server import HTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from urllib import request, error
from urllib.parse import urlparse

HOST = "127.0.0.1"
PORT = 8080
BASE_DIR = Path(__file__).resolve().parent


def build_fallback_analysis(topic: str, mode: str):
    deep = mode == "deep"
    now = datetime.utcnow()

    events = [
        {
            "id": 1,
            "tytul": "Presja na glownych szlakach morskich",
            "opis": "Rosnie liczba incydentow i opoznien, co podnosi koszt transportu i ryzyko operacyjne.",
            "kategoria": "transport",
            "lokalizacja": {"nazwa": "Morze Czerwone", "lat": 20.0, "lng": 38.0},
            "data": (now - timedelta(days=2)).strftime("%Y-%m-%d"),
            "zrodlo": "Copilot Agent Local Fallback",
            "waznosc": 5,
        },
        {
            "id": 2,
            "tytul": "Napiecia regulacyjne i sankcyjne",
            "opis": "Zmiany regulacyjne i sankcje moga szybko zmieniac dostepnosc tras oraz partnerow handlowych.",
            "kategoria": "geopolityka",
            "lokalizacja": {"nazwa": "Bruksela", "lat": 50.8503, "lng": 4.3517},
            "data": (now - timedelta(days=4)).strftime("%Y-%m-%d"),
            "zrodlo": "Copilot Agent Local Fallback",
            "waznosc": 4,
        },
        {
            "id": 3,
            "tytul": "Skok zmiennosci kosztow logistycznych",
            "opis": "Wzrost stawek frachtu i skladek ubezpieczeniowych przeklada sie na ryzyko marzy i terminow.",
            "kategoria": "logistyka",
            "lokalizacja": {"nazwa": "Singapur", "lat": 1.3521, "lng": 103.8198},
            "data": (now - timedelta(days=1)).strftime("%Y-%m-%d"),
            "zrodlo": "Copilot Agent Local Fallback",
            "waznosc": 4,
        },
    ]

    if deep:
        events.append(
            {
                "id": 4,
                "tytul": "Przesuniecia popytu regionalnego",
                "opis": "Firmy przebudowuja lancuchy dostaw, aby zmniejszyc zaleznosc od pojedynczych punktow ryzyka.",
                "kategoria": "ekonomia",
                "lokalizacja": {"nazwa": "Szanghaj", "lat": 31.2304, "lng": 121.4737},
                "data": (now - timedelta(days=6)).strftime("%Y-%m-%d"),
                "zrodlo": "Copilot Agent Local Fallback",
                "waznosc": 3,
            }
        )

    response = {
        "temat": topic,
        "podsumowanie": (
            "Analiza poglobiona wskazuje na nakladajace sie czynniki geopolityczne, "
            "transportowe i kosztowe. Najwieksze ryzyko dotyczy naglych zmian tras i kosztow operacyjnych."
            if deep
            else "Szybka analiza wskazuje na zwiazek miedzy ryzykiem geopolitycznym a stabilnoscia transportu i logistyki."
        ),
        "wydarzenia": events,
        "korelacje": [
            {
                "wydarzenia_ids": [1, 3],
                "opis": "Rosnace ryzyko na szlakach morskich wzmacnia presje kosztowa w logistyce.",
                "sila": 5,
            },
            {
                "wydarzenia_ids": [2, 3],
                "opis": "Zmiany regulacyjne przyspieszaja korekty kontraktow i kosztow operacyjnych.",
                "sila": 4,
            },
        ],
        "wnioski": [
            "Kluczowe jest codzienne monitorowanie szlakow wysokiego ryzyka.",
            "Warto przygotowac alternatywne trasy i scenariusze kontraktowe.",
            "Najwieksza niepewnosc wynika z polaczenia ryzyka geopolitycznego i kosztowego.",
        ],
        "tezy_rozwoju": [
            {
                "teza": "Utrzyma sie podwyzszona zmiennosc kosztow transportu i ubezpieczen.",
                "prawdopodobienstwo": "wysokie",
                "horyzont": "1-3 miesiace",
                "uzasadnienie": "Obecne sygnaly wskazuja na brak stabilizacji glownych czynnikow ryzyka.",
            },
            {
                "teza": "Czesc operatorow przyspieszy regionalizacje lancuchow dostaw.",
                "prawdopodobienstwo": "srednie",
                "horyzont": "3-9 miesiecy",
                "uzasadnienie": "Dywersyfikacja staje sie standardem ograniczania ryzyka.",
            },
        ],
    }
    if deep:
        response["kontekst_historyczny"] = (
            "Podobne okresy napiec zwykle skutkowaly przejsciowym wzrostem kosztow i rekonfiguracja szlakow dostaw."
        )

    return response


def call_upstream(payload: dict):
    upstream_url = os.getenv("COPILOT_AGENT_URL", "").strip()
    if not upstream_url:
        return None

    parsed = urlparse(upstream_url)
    if parsed.scheme in {"http", "https"}:
        host = parsed.hostname or ""
        port = parsed.port or (80 if parsed.scheme == "http" else 443)
        # Zabezpieczenie przed zapetleniem: upstream == ten sam endpoint lokalny.
        if host in {"127.0.0.1", "localhost"} and port == PORT and parsed.path == "/api/copilot-agent/analyze":
            return None

    req = request.Request(
        upstream_url,
        method="POST",
        headers={"Content-Type": "application/json"},
        data=json.dumps(payload).encode("utf-8"),
    )

    try:
        with request.urlopen(req, timeout=45) as resp:
            data = resp.read().decode("utf-8")
            return json.loads(data)
    except (error.HTTPError, error.URLError, TimeoutError, json.JSONDecodeError):
        return None


class DashboardHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(BASE_DIR), **kwargs)

    def _send_json(self, payload, status=200):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        if self.path == "/api/copilot-agent/analyze":
            self.send_response(204)
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
            self.send_header("Access-Control-Allow-Headers", "Content-Type")
            self.end_headers()
            return
        self.send_response(404)
        self.end_headers()

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
        mode = str(payload.get("mode", "quick")).strip().lower()
        if not topic:
            self._send_json({"error": "Pole 'topic' jest wymagane"}, status=400)
            return
        if mode not in {"quick", "deep"}:
            mode = "quick"

        upstream_resp = call_upstream(payload)
        if upstream_resp is not None:
            self._send_json(upstream_resp, status=200)
            return

        analysis = build_fallback_analysis(topic, mode)
        self._send_json({"analysis": analysis, "provider": "local-fallback"}, status=200)


def main():
    server = HTTPServer((HOST, PORT), DashboardHandler)
    print(f"[OK] Serwer dashboardu: http://{HOST}:{PORT}")
    print("[INFO] Endpoint analizy: POST /api/copilot-agent/analyze")
    print("[INFO] Opcjonalny upstream: ustaw zmienna COPILOT_AGENT_URL")
    server.serve_forever()


if __name__ == "__main__":
    main()
