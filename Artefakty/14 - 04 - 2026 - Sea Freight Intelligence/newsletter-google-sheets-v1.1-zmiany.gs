// Sea Freight Intelligence — v1.1 (zmiany pod stabilnosc)
// Data: 14.04.2026
// Zmiany:
// 1) Lzejszy model Gemini
// 2) maxOutputTokens = 4000
// 3) MAX_ARTICLES bez zmian (dalej 30)


// === PODMIANA 1: CONFIG ===
// Podmien tylko ponizsze pola w obiekcie CONFIG.

var CONFIG = {
  // LLM Provider: 'gemini' lub 'openrouter'
  LLM_PROVIDER: 'gemini',

  // Gemini (zmiana na lzejszy model)
  GEMINI_MODEL: 'gemini-2.0-flash',
  GEMINI_URL: 'https://generativelanguage.googleapis.com/v1beta/models/',

  // OpenRouter (alternatywa darmowa, działa w UE)
  OPENROUTER_MODEL: 'google/gemini-2.0-flash-exp:free',
  OPENROUTER_URL: 'https://openrouter.ai/api/v1/chat/completions',

  // Nazwy zakladek w arkuszu
  SHEET_CONFIG: 'Config',
  SHEET_RAW: 'Raw',
  SHEET_DIGEST: 'Digest',
  SHEET_LOG: 'Log',

  // Max artykulow do przetworzenia na raz (BEZ ZMIAN)
  MAX_ARTICLES: 30,

  // Max znakow na artykul
  MAX_ARTICLE_LENGTH: 800,

  // Ile dni wstecz zbierac artykuly
  DAYS_BACK: 7
};


// === PODMIANA 2: callGemini_ ===
// W funkcji callGemini_ podmien generationConfig.maxOutputTokens z 8000 na 4000.

function callGemini_(systemPrompt, userPrompt) {
  var apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
  if (!apiKey) throw new Error('Brak GEMINI_API_KEY w właściwościach skryptu!');

  var url = CONFIG.GEMINI_URL + CONFIG.GEMINI_MODEL + ':generateContent';

  var payload = {
    system_instruction: {
      parts: [{ text: systemPrompt }]
    },
    contents: [{
      parts: [{ text: userPrompt }]
    }],
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 4000
    }
  };

  var options = {
    method: 'post',
    contentType: 'application/json',
    headers: { 'x-goog-api-key': apiKey },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  var response = UrlFetchApp.fetch(url, options);
  var code = response.getResponseCode();

  if (code !== 200) {
    throw new Error('Gemini API error ' + code + ': ' + response.getContentText().substring(0, 500));
  }

  var data = JSON.parse(response.getContentText());

  if (data.candidates && data.candidates[0] && data.candidates[0].content) {
    return data.candidates[0].content.parts[0].text;
  }

  throw new Error('Gemini: brak odpowiedzi w response');
}


// === CHECKLISTA PO PODMIANIE ===
// 1) Ustaw nowy klucz newslettera w Script Properties jako GEMINI_API_KEY
// 2) Uruchom testPipeline()
// 3) Sprawdz zakladke Log i AI Studio metrics dla nowego klucza
