// ============================================================
// SEA FREIGHT INTELLIGENCE — MVP
// Google Apps Script — wklej w Rozszerzenia > Apps Script
// ============================================================
// Autor: M&M air sea cargo S.A. — Dział morski
// Wersja: 1.1 MVP
// ============================================================

// ==================== KONFIGURACJA ==========================
// Ustaw te wartości w: Ustawienia projektu > Właściwości skryptu
// Klucz: GEMINI_API_KEY  Wartość: Twój klucz API z https://aistudio.google.com/apikey
// Klucz: RECIPIENTS       Wartość: email1@firma.pl,email2@firma.pl
//
// WAŻNE: Gemini free tier NIE działa w UE.
// Obejście: użyj VPN (US) przy generowaniu klucza,
// lub użyj płatny tier ($0 do ~$0.30/tydzień).
// Alternatywa: zamień na OpenRouter (darmowe modele) — patrz sekcja LLM_PROVIDER
// ============================================================

var CONFIG = {
  // LLM Provider: 'gemini' lub 'openrouter'
  LLM_PROVIDER: 'openrouter',
  
  // Gemini (zmienione na lżejszy model)
  GEMINI_MODEL: 'gemini-2.0-flash',
  GEMINI_URL: 'https://generativelanguage.googleapis.com/v1beta/models/',
  
  // OpenRouter (alternatywa darmowa, działa w UE)
  // Zarejestruj się na https://openrouter.ai → darmowe modele zmieniają się dynamicznie
  OPENROUTER_MODEL: 'google/gemma-4-26b-a4b-it:free',
  OPENROUTER_FALLBACK_MODELS: [
    'mistralai/mistral-7b-instruct:free',
    'meta-llama/llama-3.2-3b-instruct:free'
  ],
  OPENROUTER_URL: 'https://openrouter.ai/api/v1/chat/completions',
  OPENROUTER_MAX_RETRIES: 3,
  OPENROUTER_RETRY_BASE_MS: 2000,
  
  // Nazwy zakładek w arkuszu
  SHEET_CONFIG: 'Config',
  SHEET_RAW: 'Raw',
  SHEET_DIGEST: 'Digest',
  SHEET_LOG: 'Log',
  
  // Max artykułów do przetworzenia na raz (limit tokenów)
  MAX_ARTICLES: 30,
  
  // Max znaków na artykuł (przycinamy długie teksty)
  MAX_ARTICLE_LENGTH: 800,
  
  // Ile dni wstecz zbierać artykuły
  DAYS_BACK: 7
};


// ============================================================
// 1. MASTER PIPELINE — uruchom ręcznie lub przez trigger
// ============================================================

/**
 * Główna funkcja — uruchom ręcznie lub ustaw trigger tygodniowy.
 * Pipeline: zbierz RSS → przetwórz przez LLM → wyślij email.
 */
function runWeeklyPipeline() {
  log_('Pipeline START');
  
  try {
    // Krok 1: Zbierz artykuły z RSS
    var articles = collectFeeds_();
    log_('Zebrano artykułów: ' + articles.length);
    
    if (articles.length === 0) {
      log_('Brak nowych artykułów — pomijam digest');
      return;
    }
    
    // Krok 2: Zapisz surowe dane
    saveRawArticles_(articles);
    
    // Krok 3: Wygeneruj digest przez LLM
    var digest = generateDigest_(articles);
    log_('Digest wygenerowany: ' + digest.length + ' znaków');
    
    // Walidacja: czy wszystkie sekcje są obecne?
    var requiredSections = ['STAWKI', 'PODAŻ', 'PORTY', 'HANDEL', 'SZANSE', 'PROGNOZA'];
    var missingSections = requiredSections.filter(function(s) { return digest.indexOf(s) === -1; });
    if (missingSections.length > 0) {
      log_('⚠️ UWAGA: Brakujące sekcje w digest: ' + missingSections.join(', ') + ' — odpowiedź LLM mogła zostać obcięta!');
    }
    
    // Krok 4: Zapisz digest
    saveDigest_(digest);
    
    // Krok 5: Wyślij email
    sendDigestEmail_(digest);
    log_('Email wysłany!');
    
    log_('Pipeline END — sukces');
    
  } catch (e) {
    log_('BŁĄD: ' + e.toString());
    // Wyślij alert o błędzie do siebie
    try {
      MailApp.sendEmail(
        Session.getActiveUser().getEmail(),
        '❌ Sea Freight Intelligence — BŁĄD',
        'Pipeline zakończył się błędem:\n\n' + e.toString() + '\n\nSprawdź zakładkę Log.'
      );
    } catch(e2) {}
  }
}


/**
 * Test — odpal ręcznie żeby sprawdzić czy wszystko działa.
 * Zbiera artykuły, generuje digest, ALE NIE WYSYŁA emaila.
 */
function testPipeline() {
  log_('TEST START');
  var articles = collectFeeds_();
  log_('Zebrano: ' + articles.length);
  
  if (articles.length === 0) {
    log_('Brak artykułów — sprawdź źródła RSS w zakładce Config');
    return;
  }
  
  saveRawArticles_(articles);
  var digest = generateDigest_(articles);
  saveDigest_(digest);
  
  log_('TEST END — digest gotowy w zakładce Digest (email NIE wysłany)');
  log_('Podgląd (pierwsze 500 znaków): ' + digest.substring(0, 500));
}


// ============================================================
// 2. COLLECTOR — zbieranie RSS
// ============================================================

function collectFeeds_() {
  var feeds = getFeedUrls_();
  var allArticles = [];
  var cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - CONFIG.DAYS_BACK);
  
  // Zbierz równolegle (fetchAll jest szybsze)
  var requests = feeds.map(function(f) {
    return { url: f.url, muteHttpExceptions: true };
  });
  
  var responses;
  try {
    responses = UrlFetchApp.fetchAll(requests);
  } catch(e) {
    log_('fetchAll error: ' + e.toString());
    // Fallback: pobieraj po kolei
    responses = feeds.map(function(f) {
      try { return UrlFetchApp.fetch(f.url, { muteHttpExceptions: true }); }
      catch(e) { return null; }
    });
  }
  
  for (var i = 0; i < responses.length; i++) {
    if (!responses[i] || responses[i].getResponseCode() !== 200) {
      log_('Błąd pobierania: ' + feeds[i].url + ' (kod: ' + (responses[i] ? responses[i].getResponseCode() : 'null') + ')');
      continue;
    }
    
    try {
      var items = parseRssFeed_(responses[i].getContentText(), feeds[i]);
      items.forEach(function(item) {
        // Filtruj po dacie
        if (item.date >= cutoffDate) {
          allArticles.push(item);
        }
      });
    } catch(e) {
      log_('Parse error (' + feeds[i].name + '): ' + e.toString());
    }
  }
  
  // Deduplikacja po tytule
  var seen = {};
  allArticles = allArticles.filter(function(a) {
    var key = a.title.toLowerCase().replace(/\s+/g, ' ').trim();
    if (seen[key]) return false;
    seen[key] = true;
    return true;
  });
  
  // === SCRAPING: dodaj dane ze stron bez RSS ===
  try {
    var scraped = collectScrapedSources_();
    allArticles = allArticles.concat(scraped);
    log_('Scraping: ' + scraped.length + ' dodatkowych wpisów');
  } catch(e) {
    log_('Scraping error: ' + e.toString());
  }
  
  // Sortuj od najnowszego
  allArticles.sort(function(a, b) { return b.date - a.date; });
  
  // Limit
  return allArticles.slice(0, CONFIG.MAX_ARTICLES);
}


function parseRssFeed_(xml, feedInfo) {
  var items = [];
  
  try {
    var doc = XmlService.parse(xml);
    var root = doc.getRootElement();
    
    // Standard RSS 2.0
    var channel = root.getChild('channel');
    if (channel) {
      var entries = channel.getChildren('item');
      entries.forEach(function(entry) {
        items.push({
          title: safeGetText_(entry, 'title'),
          link: safeGetText_(entry, 'link'),
          description: cleanHtml_(safeGetText_(entry, 'description')),
          date: parseDate_(safeGetText_(entry, 'pubDate')),
          source: feedInfo.name,
          category: feedInfo.category
        });
      });
      return items;
    }
    
    // Atom feed
    var ns = root.getNamespace();
    var entries = root.getChildren('entry', ns);
    if (entries && entries.length > 0) {
      entries.forEach(function(entry) {
        var linkEl = entry.getChildren('link', ns);
        var link = '';
        linkEl.forEach(function(l) {
          var rel = l.getAttribute('rel');
          if (!rel || rel.getValue() === 'alternate') {
            link = l.getAttribute('href') ? l.getAttribute('href').getValue() : '';
          }
        });
        
        var content = '';
        var contentEl = entry.getChild('content', ns);
        var summaryEl = entry.getChild('summary', ns);
        if (contentEl) content = cleanHtml_(contentEl.getText());
        else if (summaryEl) content = cleanHtml_(summaryEl.getText());
        
        items.push({
          title: entry.getChild('title', ns) ? entry.getChild('title', ns).getText() : '',
          link: link,
          description: content,
          date: parseDate_(entry.getChild('updated', ns) ? entry.getChild('updated', ns).getText() : 
                           entry.getChild('published', ns) ? entry.getChild('published', ns).getText() : ''),
          source: feedInfo.name,
          category: feedInfo.category
        });
      });
    }
    
  } catch(e) {
    log_('XML parse error (' + feedInfo.name + '): ' + e.toString());
  }
  
  return items;
}


function safeGetText_(element, childName) {
  var child = element.getChild(childName);
  return child ? child.getText() : '';
}


function cleanHtml_(html) {
  if (!html) return '';
  // Usuń tagi HTML
  var text = html.replace(/<[^>]+>/g, ' ');
  // Dekoduj encje
  text = text.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ');
  // Usuń wielokrotne spacje
  text = text.replace(/\s+/g, ' ').trim();
  // Przytnij
  if (text.length > CONFIG.MAX_ARTICLE_LENGTH) {
    text = text.substring(0, CONFIG.MAX_ARTICLE_LENGTH) + '...';
  }
  return text;
}


function parseDate_(dateStr) {
  if (!dateStr) return new Date(0);
  try {
    return new Date(dateStr);
  } catch(e) {
    return new Date(0);
  }
}


// ============================================================
// 2b. SCRAPER — strony bez RSS
// ============================================================

function collectScrapedSources_() {
  var results = [];
  
  // Lista scraperów — dodawaj swoje tutaj
  var scrapers = [
    { name: 'Freightos FBX', fn: scrape_FreightosFBX_ },
    { name: 'Drewry', fn: scrape_Drewry_ },
    { name: 'Alphaliner', fn: scrape_Alphaliner_ }
  ];
  
  scrapers.forEach(function(s) {
    try {
      var items = s.fn();
      if (items && items.length > 0) {
        results = results.concat(items);
      }
    } catch(e) {
      log_('Scraper ' + s.name + ' error: ' + e.toString());
    }
  });
  
  return results;
}


function scrape_FreightosFBX_() {
  var url = 'https://www.freightos.com/freight-resources/container-shipping-cost-calculator-free-tool/';
  var html = fetchPage_(url);
  if (!html) return [];
  
  var items = [];
  
  var rateRegex = /([A-Za-z\-\.\s]+?prices?\s*)\(FBX(\d+)\s*Weekly\)\s*(rose|fell|dropped|increased|decreased|unchanged)[^$]*?\$([0-9,]+)\/FEU/gi;
  var match;
  
  while ((match = rateRegex.exec(html)) !== null) {
    var lane = match[1].trim();
    var fbxCode = 'FBX' + match[2];
    var direction = match[3].toLowerCase();
    var rate = match[4];
    
    var trend = '→';
    if (direction === 'rose' || direction === 'increased') trend = '↑';
    if (direction === 'fell' || direction === 'dropped' || direction === 'decreased') trend = '↓';
    
    items.push({
      title: fbxCode + ': ' + lane + ' — $' + rate + '/FEU ' + trend,
      link: url,
      description: 'Freightos Baltic Index ' + fbxCode + ': ' + lane + ' ' + direction + ' to $' + rate + '/FEU (40ft container, spot rate).',
      date: new Date(),
      source: 'Freightos FBX',
      category: 'stawki'
    });
  }
  
  if (items.length === 0) {
    var summaryRegex = /(?:transpacific|asia[–\-\s]*(?:us|europe|med)|rates?\s+(?:rose|fell|continued))[^.]*\.\s*[^.]*\./gi;
    var sMatch;
    while ((sMatch = summaryRegex.exec(html)) !== null && items.length < 3) {
      var text = cleanHtml_(sMatch[0]);
      if (text.length > 40) {
        items.push({
          title: 'Freightos Weekly Rate Update',
          link: url,
          description: text,
          date: new Date(),
          source: 'Freightos FBX',
          category: 'stawki'
        });
      }
    }
  }
  
  return items;
}


function scrape_Drewry_() {
  var url = 'https://www.drewry.co.uk/supply-chain-advisors/supply-chain-expertise/world-container-index-assessed-by-drewry';
  var html = fetchPage_(url);
  if (!html) return [];
  
  var items = [];
  
  var wciRegex = /(?:WCI|World Container Index|composite)[^$]*?\$([0-9,]+)\s*(?:per|\/)\s*(?:40|FEU|forty)/gi;
  var match = wciRegex.exec(html);
  
  if (match) {
    items.push({
      title: 'Drewry WCI Composite: $' + match[1] + '/40ft',
      link: url,
      description: 'Drewry World Container Index composite rate: $' + match[1] + ' per 40ft container.',
      date: new Date(),
      source: 'Drewry WCI',
      category: 'stawki'
    });
  }
  
  var changeRegex = /(?:increased|decreased|rose|fell|dropped|unchanged)\s+(?:by\s+)?(\d+(?:\.\d+)?)\s*%/gi;
  var cMatch;
  while ((cMatch = changeRegex.exec(html)) !== null && items.length < 3) {
    var start = Math.max(0, cMatch.index - 80);
    var end = Math.min(html.length, cMatch.index + cMatch[0].length + 80);
    var context = cleanHtml_(html.substring(start, end));
    
    if (context.length > 30 && context.indexOf('$') >= 0) {
      items.push({
        title: 'Drewry WCI: zmiana ' + cMatch[0],
        link: url,
        description: context,
        date: new Date(),
        source: 'Drewry WCI',
        category: 'stawki'
      });
    }
  }
  
  return items;
}


function scrape_Alphaliner_() {
  var url = 'https://alphaliner.axsmarine.com/PublicTop100/';
  var html = fetchPage_(url);
  if (!html) return [];
  
  var items = [];
  
  var teuRegex = /(?:total|world|global|fleet)\s+(?:capacity|fleet)[^0-9]*?([0-9,]+)\s*TEU/gi;
  var match = teuRegex.exec(html);
  
  if (match) {
    items.push({
      title: 'Alphaliner: Globalna flota kontenerowa — ' + match[1] + ' TEU',
      link: url,
      description: 'Alphaliner Top 100: globalna flota kontenerowa: ' + match[1] + ' TEU.',
      date: new Date(),
      source: 'Alphaliner',
      category: 'fracht'
    });
  }
  
  return items;
}


function fetchPage_(url) {
  try {
    var response = UrlFetchApp.fetch(url, {
      muteHttpExceptions: true,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9,pl;q=0.8'
      },
      followRedirects: true
    });
    
    if (response.getResponseCode() === 200) {
      return response.getContentText();
    }
    log_('Fetch ' + url + ' → HTTP ' + response.getResponseCode());
    return null;
  } catch(e) {
    log_('Fetch error ' + url + ': ' + e.toString());
    return null;
  }
}


function generateDigest_(articles) {
  var articleText = articles.map(function(a, i) {
    return '[' + (i+1) + '] ' + a.source + ' (' + a.category + ') — ' + 
           formatDate_(a.date) + '\n' +
           a.title + '\n' +
           a.description + '\n' +
           'URL: ' + (a.link || '');
  }).join('\n\n---\n\n');
  
  var systemPrompt = 
    'Jesteś analitykiem rynku frachtu morskiego. Przygotowujesz tygodniowy briefing dla spedytorów firmy spedycyjnej M&M air sea cargo S.A.\n\n' +
    'Rynki priorytetowe: Chiny→Europa (główny), USA/Transatlantyk, Bliski Wschód/Indie→Europa. Inne rynki: sygnalizuj jeśli istotne.\n\n' +
    'Format odpowiedzi (używaj dokładnie tych nagłówków):\n\n' +
    '## STAWKI FRACHTOWE\n' +
    'Zmiany na kluczowych trade lanes. Podaj kierunek, typ kontenera, kwotę jeśli dostępna, trend (↑↓→).\n\n' +
    '## PODAŻ I TONAŻ\n' +
    'Blank sailings, nowe serwisy armatorów, zmiany w aliansach, orderbook.\n\n' +
    '## PORTY I KONGESTIA\n' +
    'Opóźnienia, nowe terminale, regulacje portowe.\n\n' +
    '## HANDEL I REGULACJE\n' +
    'Cła, sankcje, umowy handlowe, zmiany wolumenów na kluczowych rynkach.\n\n' +
    '## SZANSE DLA M&M\n' +
    'Konkretne okazje handlowe wynikające z powyższych zmian. Nowe kierunki, nowi potencjalni klienci, nowe trasy.\n\n' +
    '## PROGNOZA NA NASTĘPNY TYDZIEŃ\n' +
    'Max 3-4 zdania — co się prawdopodobnie wydarzy.\n\n' +
    'ZASADY:\n' +
    '- Pisz po polsku\n' +
    '- FORMATOWANIE: Każdy punkt w sekcji MUSI zaczynać się od "- " (myślnik + spacja) — to jest krytyczne dla formatowania emaila. Nigdy nie pisz akapitów ciągłym tekstem. Każda informacja = osobny bullet point zaczynający się od "- **Temat:** treść"\n' +
    '- ŹRÓDŁA: Na końcu każdego bullet pointa MUSISZ dodać klikalny link do artykułu źródłowego. Format: [Nazwa źródła](pełny URL). NIGDY nie używaj skróconych odnośników typu [1], [2] — zawsze pełny link markdown. Jeśli punkt bazuje na kilku artykułach, podaj kilka linków oddzielonych spacją.\n' +
    '- Przykład poprawnego formatu:\n' +
    '  ## STAWKI FRACHTOWE\n' +
    '  - **Freightos FBX (Asia→Europe):** $2,340/FEU — ↑ wzrost o 5% w/w. [The Loadstar](https://theloadstar.com/rates-surge-asia-europe)\n' +
    '  - **Drewry WCI Composite:** $2,870/40ft — ↓ spadek o 2%. [Container News](https://container-news.com/drewry-wci-drops) [Splash247](https://splash247.com/rates-fall)\n' +
    '- Zwięźle, konkretnie, bez wodolejstwa\n' +
    '- Każdy punkt max 2-3 zdania\n' +
    '- Podawaj liczby, daty, nazwy armatorów/portów\n' +
    '- Używaj symboli trendów: ↑ (wzrost), ↓ (spadek), → (stabilnie)\n' +
    '- Jeśli brak danych na dany temat — napisz "- Brak istotnych zmian"\n' +
    '- Bazuj WYŁĄCZNIE na dostarczonych artykułach — nie wymyślaj danych\n' +
    '- KRYTYCZNE: Musisz uwzględnić WSZYSTKIE 6 sekcji (od STAWKI do PROGNOZA). Nie kończ odpowiedzi w środku sekcji. Jeśli brakuje danych, napisz "- Brak istotnych zmian" i przejdź do następnej sekcji.\n' +
    '- Zakończ odpowiedź pełnym zdaniem w sekcji PROGNOZA';
  
  var userPrompt = 
    'Poniżej znajdują się artykuły branżowe z ostatniego tygodnia (' + articles.length + ' szt.).\n' +
    'Przygotuj tygodniowy briefing wg powyższego formatu.\n\n' +
    '=== ARTYKUŁY ===\n\n' + articleText;

  log_('LLM wybór: provider=' + CONFIG.LLM_PROVIDER + ', model=' + (CONFIG.LLM_PROVIDER === 'gemini' ? CONFIG.GEMINI_MODEL : CONFIG.OPENROUTER_MODEL));
  
  if (CONFIG.LLM_PROVIDER === 'gemini') {
    return callGemini_(systemPrompt, userPrompt);
  } else {
    return callOpenRouter_(systemPrompt, userPrompt);
  }
}


function callGemini_(systemPrompt, userPrompt) {
  var apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
  if (!apiKey) throw new Error('Brak GEMINI_API_KEY w właściwościach skryptu!');
  
  var url = CONFIG.GEMINI_URL + CONFIG.GEMINI_MODEL + ':generateContent';
  log_('Gemini request: model=' + CONFIG.GEMINI_MODEL);
  
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


function callOpenRouter_(systemPrompt, userPrompt) {
  var apiKey = PropertiesService.getScriptProperties().getProperty('OPENROUTER_API_KEY');
  if (!apiKey) throw new Error('Brak OPENROUTER_API_KEY w właściwościach skryptu!');

  var models = [CONFIG.OPENROUTER_MODEL].concat(CONFIG.OPENROUTER_FALLBACK_MODELS || []);
  var uniqueModels = [];
  var seen = {};
  models.forEach(function(m) {
    if (!m || seen[m]) return;
    seen[m] = true;
    uniqueModels.push(m);
  });

  var lastError = 'Brak szczegółów';

  for (var modelIdx = 0; modelIdx < uniqueModels.length; modelIdx++) {
    var model = uniqueModels[modelIdx];
    log_('OpenRouter request: model=' + model);

    for (var attempt = 1; attempt <= CONFIG.OPENROUTER_MAX_RETRIES; attempt++) {
      var payload = {
        model: model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3,
        max_tokens: 4000
      };

      var options = {
        method: 'post',
        contentType: 'application/json',
        headers: { 'Authorization': 'Bearer ' + apiKey },
        payload: JSON.stringify(payload),
        muteHttpExceptions: true
      };

      try {
        var response = UrlFetchApp.fetch(CONFIG.OPENROUTER_URL, options);
        var code = response.getResponseCode();
        var body = response.getContentText();

        if (code === 200) {
          var data = JSON.parse(body);
          if (data.choices && data.choices[0] && data.choices[0].message) {
            log_('OpenRouter sukces: model=' + model + ', próba=' + attempt);
            return data.choices[0].message.content;
          }
          lastError = 'OpenRouter: brak odpowiedzi w response (model=' + model + ')';
          break;
        }

        lastError = 'OpenRouter API error ' + code + ' (model=' + model + '): ' + body.substring(0, 500);
        var retryable = isOpenRouterRetryable_(code, body);

        if (retryable && attempt < CONFIG.OPENROUTER_MAX_RETRIES) {
          var waitMs = getBackoffMs_(attempt, CONFIG.OPENROUTER_RETRY_BASE_MS);
          log_('OpenRouter retry: model=' + model + ', próba=' + attempt + ', kod=' + code + ', czekam=' + waitMs + 'ms');
          Utilities.sleep(waitMs);
          continue;
        }

        log_('OpenRouter zmiana modelu po błędzie: model=' + model + ', kod=' + code);
        break;

      } catch (e) {
        lastError = 'OpenRouter fetch error (model=' + model + '): ' + e.toString();
        if (attempt < CONFIG.OPENROUTER_MAX_RETRIES) {
          var waitOnExceptionMs = getBackoffMs_(attempt, CONFIG.OPENROUTER_RETRY_BASE_MS);
          log_('OpenRouter wyjątek, retry: model=' + model + ', próba=' + attempt + ', czekam=' + waitOnExceptionMs + 'ms');
          Utilities.sleep(waitOnExceptionMs);
          continue;
        }
        log_('OpenRouter zmiana modelu po wyjątku: model=' + model);
        break;
      }
    }
  }

  throw new Error('OpenRouter: wyczerpano retry i fallback modeli. Ostatni błąd: ' + lastError);
}

function isOpenRouterRetryable_(code, body) {
  if (code === 408 || code === 409 || code === 429 || code === 500 || code === 502 || code === 503 || code === 504) {
    return true;
  }

  var text = (body || '').toLowerCase();
  return text.indexOf('temporarily rate-limited') !== -1 ||
         text.indexOf('rate limit') !== -1 ||
         text.indexOf('provider returned error') !== -1 ||
         text.indexOf('upstream') !== -1;
}

function getBackoffMs_(attempt, baseMs) {
  var exp = Math.pow(2, attempt - 1);
  var jitter = Math.floor(Math.random() * 500);
  return (baseMs * exp) + jitter;
}


// ============================================================
// 4. DISTRIBUTOR — email
// ============================================================

function sendDigestEmail_(digestMarkdown) {
  var recipients = getRecipients_();
  if (!recipients || recipients.length === 0) {
    log_('Brak odbiorców — sprawdź RECIPIENTS we właściwościach skryptu lub zakładkę Config');
    return;
  }
  
  var weekNum = getWeekNumber_(new Date());
  var subject = '🚢 Sea Freight Intelligence — Tydzień ' + weekNum + '/' + new Date().getFullYear();
  var llmLabel = CONFIG.LLM_PROVIDER === 'gemini' ? CONFIG.GEMINI_MODEL : CONFIG.OPENROUTER_MODEL;
  
  var htmlBody = convertToHtmlEmail_(digestMarkdown, weekNum, llmLabel);
  
  recipients.forEach(function(email) {
    try {
      MailApp.sendEmail({
        to: email.trim(),
        subject: subject,
        htmlBody: htmlBody,
        name: 'Sea Freight Intelligence — M&M'
      });
      log_('Email wysłany do: ' + email);
    } catch(e) {
      log_('Błąd wysyłki do ' + email + ': ' + e.toString());
    }
  });
}


function convertToHtmlEmail_(markdown, weekNum, llmLabel) {
  var today = formatDate_(new Date());
  var year = new Date().getFullYear();
  
  var navy     = '#0A1E3D';
  var blue     = '#0055A4';
  var lightBl  = '#7FB3DE';
  var red      = '#E63B2E';
  var green    = '#0D9E6C';
  var greyBg   = '#F4F6F9';
  var greyText = '#4A5568';
  var greyMuted= '#8A95A5';
  var white    = '#FFFFFF';
  var borderLt = '#E2E8F0';
  
  function getIcon(title) {
    var lower = title.toLowerCase();
    if (lower.indexOf('stawki') !== -1 || lower.indexOf('fracht') !== -1) return '&#128202;';
    if (lower.indexOf('poda') !== -1 || lower.indexOf('tona') !== -1) return '&#128674;';
    if (lower.indexOf('port') !== -1 || lower.indexOf('kongest') !== -1) return '&#9875;';
    if (lower.indexOf('handel') !== -1 || lower.indexOf('regulac') !== -1) return '&#127758;';
    if (lower.indexOf('szans') !== -1 || lower.indexOf('rekomend') !== -1) return '&#128161;';
    if (lower.indexOf('prognoz') !== -1 || lower.indexOf('perspektyw') !== -1) return '&#128302;';
    return '&#128204;';
  }
  
  var html = markdown
    .replace(/^## (.+)$/gm, function(match, title) {
      var icon = getIcon(title);
      return '</td></tr></table>' +
        '<table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:24px 0 12px">' +
        '<tr>' +
        '<td width="4" style="background:' + blue + '"></td>' +
        '<td style="background:' + greyBg + ';padding:10px 16px">' +
        '<span style="font-size:15px;font-weight:bold;color:' + navy + '">' + icon + ' &nbsp;' + title + '</span>' +
        '</td>' +
        '</tr></table>' +
        '<table cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td style="padding:0 4px">';
    })
    .replace(/^### (.+)$/gm, '<div style="font-size:13px;font-weight:bold;color:' + blue + ';margin:14px 0 6px;padding-bottom:4px;border-bottom:1px solid ' + borderLt + '">$1</div>')
    .replace(/\*\*(.+?)\*\*/g, '<strong style="color:' + navy + '">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color:' + blue + ';font-size:11px;text-decoration:none">[$1]</a>')
    .replace(/^[\-\*] (.+)$/gm, '<div style="margin:6px 0;padding-left:16px;font-size:13px;line-height:1.6;color:' + greyText + '">&#8226; $1</div>')
    .replace(/↑/g, '<span style="color:' + green + ';font-weight:bold">&#9650;</span>')
    .replace(/↓/g, '<span style="color:' + red + ';font-weight:bold">&#9660;</span>')
    .replace(/→/g, '<span style="color:' + greyMuted + ';font-weight:bold">&#9654;</span>')
    .replace(/▲/g, '<span style="color:' + green + ';font-weight:bold">&#9650;</span>')
    .replace(/▼/g, '<span style="color:' + red + ';font-weight:bold">&#9660;</span>')
    .replace(/▶/g, '<span style="color:' + greyMuted + ';font-weight:bold">&#9654;</span>')
    .replace(/\n\n/g, '</p><p style="margin:8px 0;font-size:13px;line-height:1.6;color:' + greyText + '">')
    .replace(/\n/g, '<br>');
  
  var template = '' +
    '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">' +
    '<html xmlns="http://www.w3.org/1999/xhtml"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>' +
    '<body style="font-family:Arial,Helvetica,sans-serif;background:' + greyBg + ';margin:0;padding:0">' +
    
    '<table cellpadding="0" cellspacing="0" border="0" width="100%" style="background:' + greyBg + '">' +
    '<tr><td align="center" style="padding:20px 10px">' +
    
    '<table cellpadding="0" cellspacing="0" border="0" width="640" style="max-width:640px;width:100%;background:' + white + ';border:1px solid ' + borderLt + '">' +
    
    '<tr><td style="background:' + navy + ';padding:20px 32px">' +
    '<table cellpadding="0" cellspacing="0" border="0" width="100%">' +
    '<tr><td>' +
    '<span style="font-size:18px;font-weight:bold;color:' + white + '">Sea Freight Intelligence</span>' +
    '<br />' +
    '<span style="font-size:12px;color:' + lightBl + '">Tygodniowy briefing &middot; Tydzien ' + weekNum + '/' + year + ' &middot; ' + today + ' &middot; LLM: ' + llmLabel + '</span>' +
    '</td></tr>' +
    '</table>' +
    '</td></tr>' +
    '<tr><td style="padding:0;line-height:0"><table cellpadding="0" cellspacing="0" border="0" width="100%"><tr>' +
    '<td width="25%" height="3" style="background:' + red + ';font-size:1px">&nbsp;</td>' +
    '<td width="25%" height="3" style="background:' + blue + ';font-size:1px">&nbsp;</td>' +
    '<td width="25%" height="3" style="background:' + lightBl + ';font-size:1px">&nbsp;</td>' +
    '<td width="25%" height="3" style="background:' + navy + ';font-size:1px">&nbsp;</td>' +
    '</tr></table></td></tr>' +
    
    '<tr><td style="padding:16px 32px 8px">' +
    '<table cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td style="padding:0 4px">' +
    '<p style="margin:8px 0;font-size:13px;line-height:1.6;color:' + greyText + '">' + html + '</p>' +
    '</td></tr></table>' +
    '</td></tr>' +
    
    '<tr><td style="padding:4px 32px 20px">' +
    '<table cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#FFF8F0;border:1px solid #FFE4C4">' +
    '<tr><td style="padding:10px 14px;font-size:11px;color:#B8860B;line-height:1.5">' +
    '&#9888; Tre&#347;&#263; wygenerowana automatycznie przez AI. Weryfikuj dane przed podj&#281;ciem decyzji.' +
    '</td></tr></table>' +
    '</td></tr>' +
    
    '<tr><td style="background:' + greyBg + ';padding:14px 32px;border-top:1px solid ' + borderLt + '">' +
    '<span style="font-size:11px;color:' + greyMuted + '">Sea Freight Intelligence &middot; M&amp;M air sea cargo S.A.</span>' +
    '</td></tr>' +
    
    '</table>' +
    '</td></tr></table>' +
    '</body></html>';
  
  return template;
}


// ============================================================
// 5. SETUP — uruchom RAZ żeby stworzyć strukturę arkusza
// ============================================================

function setupSpreadsheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  var config = getOrCreateSheet_(ss, CONFIG.SHEET_CONFIG);
  config.clear();
  config.getRange(1, 1, 1, 3).setValues([['Nazwa', 'URL', 'Kategoria']]);
  config.getRange(1, 1, 1, 3).setFontWeight('bold').setBackground('#004785').setFontColor('#ffffff');
  
  var feeds = [
    ['The Loadstar', 'https://theloadstar.com/feed/', 'fracht'],
    ['Splash247', 'https://splash247.com/feed/', 'fracht'],
    ['Container News', 'https://container-news.com/feed/', 'fracht'],
    ['gCaptain', 'https://gcaptain.com/feed/', 'fracht'],
    ['Seatrade Maritime', 'https://www.seatrade-maritime.com/rss.xml', 'fracht'],
    ['Hellenic Shipping News', 'https://www.hellenicshippingnews.com/feed/', 'fracht'],
    ['Port Technology', 'https://www.porttechnology.org/feed/', 'porty'],
    ['World Maritime News', 'https://worldmaritimenews.com/feed/', 'fracht'],
    ['WTO News', 'https://www.wto.org/english/news_e/news_e.rss', 'handel'],
    ['Reuters Business', 'https://www.reutersagency.com/feed/', 'handel'],
    ['China Briefing', 'https://www.china-briefing.com/news/feed/', 'handel'],
    ['UNCTAD', 'https://unctad.org/rss.xml', 'handel'],
    ['Trade.gov Blog', 'https://www.trade.gov/rss/blog', 'handel']
  ];
  
  if (feeds.length > 0) {
    config.getRange(2, 1, feeds.length, 3).setValues(feeds);
  }
  
  config.setColumnWidth(1, 200);
  config.setColumnWidth(2, 400);
  config.setColumnWidth(3, 100);
  
  var raw = getOrCreateSheet_(ss, CONFIG.SHEET_RAW);
  raw.clear();
  raw.getRange(1, 1, 1, 6).setValues([['Data', 'Źródło', 'Kategoria', 'Tytuł', 'Treść', 'Link']]);
  raw.getRange(1, 1, 1, 6).setFontWeight('bold').setBackground('#004785').setFontColor('#ffffff');
  
  var digest = getOrCreateSheet_(ss, CONFIG.SHEET_DIGEST);
  digest.clear();
  digest.getRange(1, 1, 1, 4).setValues([['Data', 'Tydzień', 'LLM', 'Treść digesta']]);
  digest.getRange(1, 1, 1, 4).setFontWeight('bold').setBackground('#004785').setFontColor('#ffffff');
  digest.setColumnWidth(3, 260);
  digest.setColumnWidth(4, 800);
  
  var logSheet = getOrCreateSheet_(ss, CONFIG.SHEET_LOG);
  logSheet.clear();
  logSheet.getRange(1, 1, 1, 2).setValues([['Timestamp', 'Wiadomość']]);
  logSheet.getRange(1, 1, 1, 2).setFontWeight('bold').setBackground('#004785').setFontColor('#ffffff');
  logSheet.setColumnWidth(2, 600);
  
  log_('Setup zakończony — arkusz gotowy!');
  log_('Następny krok: ustaw GEMINI_API_KEY we właściwościach skryptu');
  log_('Potem uruchom: testPipeline()');
}


// ============================================================
// 6. TRIGGER SETUP — automatyzacja
// ============================================================

function createWeeklyTrigger() {
  var triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(function(t) {
    if (t.getHandlerFunction() === 'runWeeklyPipeline') {
      ScriptApp.deleteTrigger(t);
    }
  });
  
  ScriptApp.newTrigger('runWeeklyPipeline')
    .timeBased()
    .onWeekDay(ScriptApp.WeekDay.MONDAY)
    .atHour(7)
    .create();
  
  log_('Trigger ustawiony: runWeeklyPipeline — poniedziałek 7:00');
}

function createDailyTrigger() {
  var triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(function(t) {
    if (t.getHandlerFunction() === 'runDailyCheck') {
      ScriptApp.deleteTrigger(t);
    }
  });
  
  ScriptApp.newTrigger('runDailyCheck')
    .timeBased()
    .everyDays(1)
    .atHour(8)
    .create();
  
  log_('Trigger ustawiony: runDailyCheck — codziennie 8:00');
}


function runDailyCheck() {
  var urgentKeywords = [
    'blank sailing', 'port closure', 'port clos', 'surcharge', 'GRI',
    'congestion alert', 'strike', 'strajk', 'sankcj', 'embargo',
    'tariff increase', 'emergency', 'war risk', 'canal closure',
    'Suez', 'Panama Canal', 'Red Sea', 'Houthi'
  ];
  
  try {
    var articles = collectFeeds_();
    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    articles = articles.filter(function(a) { return a.date >= yesterday; });
    
    var urgent = articles.filter(function(a) {
      var text = (a.title + ' ' + a.description).toLowerCase();
      return urgentKeywords.some(function(kw) { return text.indexOf(kw.toLowerCase()) >= 0; });
    });
    
    if (urgent.length > 0) {
      var body = '⚠️ PILNE ZMIANY NA RYNKU MORSKIM\n\n';
      urgent.forEach(function(a) {
        body += '• ' + a.title + '\n  Źródło: ' + a.source + ' | ' + formatDate_(a.date) + '\n  ' + a.link + '\n\n';
      });
      
      var recipients = getRecipients_();
      recipients.forEach(function(email) {
        MailApp.sendEmail({
          to: email.trim(),
          subject: '⚠️ ALERT: ' + urgent.length + ' pilnych zmian na rynku morskim',
          body: body,
          name: 'Sea Freight Intelligence — M&M'
        });
      });
      
      log_('Daily alert wysłany: ' + urgent.length + ' pilnych artykułów');
    } else {
      log_('Daily check: brak pilnych zmian');
    }
  } catch(e) {
    log_('Daily check error: ' + e.toString());
  }
}


// ============================================================
// 7. HELPERS
// ============================================================

function getOrCreateSheet_(ss, name) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) sheet = ss.insertSheet(name);
  return sheet;
}

function getFeedUrls_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG.SHEET_CONFIG);
  if (!sheet) throw new Error('Brak zakładki Config — uruchom setupSpreadsheet()');
  
  var data = sheet.getDataRange().getValues();
  var feeds = [];
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] && data[i][1]) {
      feeds.push({
        name: data[i][0],
        url: data[i][1],
        category: data[i][2] || 'inne'
      });
    }
  }
  return feeds;
}

function getRecipients_() {
  var recipients = PropertiesService.getScriptProperties().getProperty('RECIPIENTS');
  if (recipients) return recipients.split(',');
  return [Session.getActiveUser().getEmail()];
}

function saveRawArticles_(articles) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG.SHEET_RAW);
  if (!sheet) return;
  
  var rows = articles.map(function(a) {
    return [formatDate_(a.date), a.source, a.category, a.title, a.description.substring(0, 500), a.link];
  });
  
  if (rows.length > 0) {
    sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, 6).setValues(rows);
  }
}

function saveDigest_(digest) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG.SHEET_DIGEST);
  if (!sheet) return;
  
  var weekNum = getWeekNumber_(new Date());
  var llmLabel = CONFIG.LLM_PROVIDER === 'gemini' ? CONFIG.GEMINI_MODEL : CONFIG.OPENROUTER_MODEL;
  sheet.getRange(sheet.getLastRow() + 1, 1, 1, 4).setValues([
    [formatDate_(new Date()), 'T' + weekNum + '/' + new Date().getFullYear(), llmLabel, digest]
  ]);
}

function log_(message) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(CONFIG.SHEET_LOG);
    if (!sheet) sheet = ss.insertSheet(CONFIG.SHEET_LOG);
    sheet.getRange(sheet.getLastRow() + 1, 1, 1, 2).setValues([
      [new Date().toLocaleString('pl-PL'), message]
    ]);
  } catch(e) {
    console.log(message);
  }
}

function formatDate_(date) {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) return '—';
  return Utilities.formatDate(date, Session.getScriptTimeZone(), 'dd.MM.yyyy');
}

function getWeekNumber_(date) {
  var d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  var dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}
