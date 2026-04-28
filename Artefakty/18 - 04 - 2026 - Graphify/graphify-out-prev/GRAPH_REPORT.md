# Graph Report - C:\Users\k.torebko\Desktop\KarolOS  (2026-04-18)

## Corpus Check
- 85 files · ~217,328 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 941 nodes · 1702 edges · 74 communities detected
- Extraction: 62% EXTRACTED · 38% INFERRED · 0% AMBIGUOUS · INFERRED: 641 edges (avg confidence: 0.64)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 53|Community 53]]
- [[_COMMUNITY_Community 54|Community 54]]
- [[_COMMUNITY_Community 55|Community 55]]
- [[_COMMUNITY_Community 56|Community 56]]
- [[_COMMUNITY_Community 57|Community 57]]
- [[_COMMUNITY_Community 58|Community 58]]
- [[_COMMUNITY_Community 59|Community 59]]
- [[_COMMUNITY_Community 60|Community 60]]
- [[_COMMUNITY_Community 61|Community 61]]
- [[_COMMUNITY_Community 62|Community 62]]
- [[_COMMUNITY_Community 63|Community 63]]
- [[_COMMUNITY_Community 64|Community 64]]
- [[_COMMUNITY_Community 65|Community 65]]
- [[_COMMUNITY_Community 66|Community 66]]
- [[_COMMUNITY_Community 67|Community 67]]
- [[_COMMUNITY_Community 68|Community 68]]
- [[_COMMUNITY_Community 69|Community 69]]
- [[_COMMUNITY_Community 70|Community 70]]
- [[_COMMUNITY_Community 71|Community 71]]
- [[_COMMUNITY_Community 72|Community 72]]
- [[_COMMUNITY_Community 73|Community 73]]

## God Nodes (most connected - your core abstractions)
1. `FindingsFilter` - 97 edges
2. `HardExclusionRules` - 86 edges
3. `SimpleClaudeRunner` - 69 edges
4. `EvaluationEngine` - 48 edges
5. `GitHubActionClient` - 34 edges
6. `EvalResult` - 30 edges
7. `get_exclusion_reason()` - 28 edges
8. `EvalCase` - 28 edges
9. `parse_json_with_fallbacks()` - 27 edges
10. `main()` - 26 edges

## Surprising Connections (you probably didn't know these)
- `Hard exclusion rules for common false positives.` --uses--> `ClaudeAPIClient`  [INFERRED]
  C:\Users\k.torebko\Desktop\KarolOS\claude-code-security-review\claudecode\findings_filter.py → C:\Users\k.torebko\Desktop\KarolOS\claude-code-security-review\claudecode\claude_api_client.py
- `Main filter class for security findings.` --uses--> `ClaudeAPIClient`  [INFERRED]
  C:\Users\k.torebko\Desktop\KarolOS\claude-code-security-review\claudecode\findings_filter.py → C:\Users\k.torebko\Desktop\KarolOS\claude-code-security-review\claudecode\claude_api_client.py
- `Filter security findings to remove false positives.                  Args:` --uses--> `ClaudeAPIClient`  [INFERRED]
  C:\Users\k.torebko\Desktop\KarolOS\claude-code-security-review\claudecode\findings_filter.py → C:\Users\k.torebko\Desktop\KarolOS\claude-code-security-review\claudecode\claude_api_client.py
- `Simplified GitHub API client for GitHub Actions environment.` --uses--> `FindingsFilter`  [INFERRED]
  C:\Users\k.torebko\Desktop\KarolOS\claude-code-security-review\claudecode\github_action_audit.py → C:\Users\k.torebko\Desktop\KarolOS\claude-code-security-review\claudecode\findings_filter.py
- `Get PR metadata and files from GitHub API.                  Args:` --uses--> `FindingsFilter`  [INFERRED]
  C:\Users\k.torebko\Desktop\KarolOS\claude-code-security-review\claudecode\github_action_audit.py → C:\Users\k.torebko\Desktop\KarolOS\claude-code-security-review\claudecode\findings_filter.py

## Communities

### Community 0 - "Community 0"
Cohesion: 0.03
Nodes (62): get_exclusion_reason(), HardExclusionRules, Hard exclusion rules for common false positives., Test JSON parser edge cases., Test parsing empty string., Test parsing whitespace-only string., Test parsing truncated JSON., Test parsing JSON with comments (invalid JSON). (+54 more)

### Community 1 - "Community 1"
Cohesion: 0.05
Nodes (74): FindingsFilter, Main filter class for security findings., Filter security findings to remove false positives.                  Args:, apply_findings_filter(), AuditError, ConfigurationError, get_environment_config(), initialize_clients() (+66 more)

### Community 2 - "Community 2"
Cohesion: 0.04
Nodes (67): authenticateRequest(), base64urlDecode(), base64urlEncode(), buildCmaConfig(), buildEmailFromName(), buildEmailFromShipment(), buildHapagConfig(), buildMaerskConfig() (+59 more)

### Community 3 - "Community 3"
Cohesion: 0.06
Nodes (60): EvalCase, EvalResult, EvaluationEngine, Evaluation engine for running SAST security audits on GitHub PRs., Get or create a lock for a repository.                  Args:             rep, Clean up locked or stale worktrees and remove untracked branches., Generate a branch name for evaluation.                  Args:             tes, Set up repository worktree for PR evaluation.                  Args: (+52 more)

### Community 4 - "Community 4"
Cohesion: 0.05
Nodes (56): Simplified Claude Code runner for GitHub Actions., Initialize Claude runner.                  Args:             timeout_minutes:, Run Claude Code security audit.                  Args:             repo_dir:, Extract security findings from Claude's JSON response., Validate that Claude Code is available., Run the security audit with Claude Code.          Args:         claude_runner, run_security_audit(), SimpleClaudeRunner (+48 more)

### Community 5 - "Community 5"
Cohesion: 0.09
Nodes (45): chooseCpuAction(), isCpuPlayActionLegal(), selectTargetPlayer(), getCard(), getPlayableCost(), getTargetRequirement(), isSpellLike(), isValidChronosTarget() (+37 more)

### Community 6 - "Community 6"
Cohesion: 0.06
Nodes (25): extract_json_from_text(), parse_json_with_fallbacks(), Extract JSON object from text, looking in various formats and locations., Parse JSON from text with multiple fallback strategies and error handling., Unit tests for the json_parser module., Test extracting JSON array from text (currently not supported)., Test extracting JSON when multiple JSON blocks exist., Test parsing valid JSON string. (+17 more)

### Community 7 - "Community 7"
Cohesion: 0.08
Nodes (19): MedicalNotesApp, Medical Notes - Profesjonalna Aplikacja Desktopowa Wersja: 2.0 | Offline | Loka, Otwórz załącznik w domyślnym programie, Tworzenie interfejsu użytkownika, Odśwież listę pacjentów, Wybierz pacjenta i wyświetl dokumentację, Wyświetl dokumentację w środkowej kolumnie, Wczytaj dane pacjentów z pliku JSON (+11 more)

### Community 8 - "Community 8"
Cohesion: 0.08
Nodes (31): Test main function execution flow., Test main with missing environment variables., Test main with missing PR number., Test main with invalid PR number., Test unexpected error handling., Test various audit failure scenarios., test_audit_failure(), test_main_claude_not_available() (+23 more)

### Community 9 - "Community 9"
Cohesion: 0.1
Nodes (27): GitHubActionClient, Get complete PR diff in unified format.                  Args:             re, Check if a file should be excluded based on directory patterns., Filter out generated files and excluded directories from diff content., Simplified GitHub API client for GitHub Actions environment., Get PR metadata and files from GitHub API.                  Args:, Test PR data retrieval when head repo is null (deleted fork)., Test GitHubActionClient functionality. (+19 more)

### Community 10 - "Community 10"
Cohesion: 0.1
Nodes (17): ClaudeAPIClient, get_claude_api_client(), Claude API client for direct Anthropic API calls., Analyze a single security finding to filter false positives using Claude API., Generate system prompt for security analysis., Generate prompt for analyzing a single security finding.                  Args, Client for calling Claude API directly for security analysis tasks., Initialize Claude API client.                  Args:             model: Claud (+9 more)

### Community 11 - "Community 11"
Cohesion: 0.11
Nodes (14): get_security_audit_prompt(), Security audit prompt templates., Generate security audit prompt for Claude Code.          Args:         pr_dat, Unit tests for the prompts module., Test basic security audit prompt generation., Test prompt generation with special characters., Test prompt generation with no files (edge case)., Test that prompt has expected structure. (+6 more)

### Community 12 - "Community 12"
Cohesion: 0.1
Nodes (15): SeaTrackImporter(), buildColIndex(), clean(), daysFromNow(), formatCity(), guessOpStatus(), parseDate(), parseTranssoft() (+7 more)

### Community 13 - "Community 13"
Cohesion: 0.16
Nodes (17): ask_question(), create_rag_chain(), create_retriever(), create_vectorstore(), load_document(), main(), RAG (Retrieval Augmented Generation) Tutorial with LangChain & Azure OpenAI ===, Split documents into smaller chunks for embedding.          Why chunk?     - (+9 more)

### Community 14 - "Community 14"
Cohesion: 0.16
Nodes (17): ask_question(), create_rag_chain(), create_retriever(), create_vectorstore(), get_api_key(), load_document(), main(), RAG (Retrieval Augmented Generation) Tutorial with LangChain & Azure OpenAI === (+9 more)

### Community 15 - "Community 15"
Cohesion: 0.12
Nodes (15): agent_node(), AgentState, get_weather(), get_word_length(), multiply(), The state that persists throughout the agent's execution.          messages: T, The 'agent' node: calls the LLM to decide what to do next.          The LLM wi, Decide whether to continue to tools or end the conversation.          - If the (+7 more)

### Community 16 - "Community 16"
Cohesion: 0.19
Nodes (9): deriveStatusFromMaerskEvents(), buildGeneratorPrefill(), deriveTimelineStatus(), mapAssigneeToGeneratorSped(), mapCarrierCodeToGeneratorArmator(), mapShipmentTypeToGeneratorType(), normalizeStatus(), openGeneratorWindow() (+1 more)

### Community 17 - "Community 17"
Cohesion: 0.27
Nodes (4): build_fallback_analysis(), call_upstream(), DashboardHandler, SimpleHTTPRequestHandler

### Community 18 - "Community 18"
Cohesion: 0.33
Nodes (4): BaseHTTPRequestHandler, call_openai_compatible(), LLMUpstreamHandler, parse_analysis_json()

### Community 19 - "Community 19"
Cohesion: 0.22
Nodes (8): get_weather(), get_word_length(), multiply(), Run the agent and return the final answer.          When verbose=True, prints, Get the current weather for a given city. Returns a short weather description., Multiply two integers together and return the result., Returns the number of characters in a word., run_agent()

### Community 20 - "Community 20"
Cohesion: 0.36
Nodes (4): apiFetch(), buildAuthenticatedUrl(), getAuthToken(), postShipmentAudit()

### Community 21 - "Community 21"
Cohesion: 0.33
Nodes (0): 

### Community 22 - "Community 22"
Cohesion: 0.4
Nodes (3): DetailPanel(), buildShipmentStatusEmail(), extractEmails()

### Community 23 - "Community 23"
Cohesion: 1.0
Nodes (4): addReactionsToComment(), addReactionsToReview(), ghApi(), run()

### Community 24 - "Community 24"
Cohesion: 0.5
Nodes (3): get_logger(), Logging configuration for ClaudeCode., Get a configured logger that outputs to stderr.          Args:         name:

### Community 25 - "Community 25"
Cohesion: 0.67
Nodes (0): 

### Community 26 - "Community 26"
Cohesion: 1.0
Nodes (2): deriveTimelineStatus(), startOfDay()

### Community 27 - "Community 27"
Cohesion: 0.67
Nodes (0): 

### Community 28 - "Community 28"
Cohesion: 1.0
Nodes (1): Constants and configuration values for ClaudeCode.

### Community 29 - "Community 29"
Cohesion: 1.0
Nodes (0): 

### Community 30 - "Community 30"
Cohesion: 1.0
Nodes (0): 

### Community 31 - "Community 31"
Cohesion: 1.0
Nodes (0): 

### Community 32 - "Community 32"
Cohesion: 1.0
Nodes (0): 

### Community 33 - "Community 33"
Cohesion: 1.0
Nodes (0): 

### Community 34 - "Community 34"
Cohesion: 1.0
Nodes (0): 

### Community 35 - "Community 35"
Cohesion: 1.0
Nodes (0): 

### Community 36 - "Community 36"
Cohesion: 1.0
Nodes (0): 

### Community 37 - "Community 37"
Cohesion: 1.0
Nodes (0): 

### Community 38 - "Community 38"
Cohesion: 1.0
Nodes (0): 

### Community 39 - "Community 39"
Cohesion: 1.0
Nodes (0): 

### Community 40 - "Community 40"
Cohesion: 1.0
Nodes (0): 

### Community 41 - "Community 41"
Cohesion: 1.0
Nodes (0): 

### Community 42 - "Community 42"
Cohesion: 1.0
Nodes (0): 

### Community 43 - "Community 43"
Cohesion: 1.0
Nodes (0): 

### Community 44 - "Community 44"
Cohesion: 1.0
Nodes (0): 

### Community 45 - "Community 45"
Cohesion: 1.0
Nodes (0): 

### Community 46 - "Community 46"
Cohesion: 1.0
Nodes (1): Test main when GitHub client initialization fails.

### Community 47 - "Community 47"
Cohesion: 1.0
Nodes (1): Test main when Claude runner initialization fails.

### Community 48 - "Community 48"
Cohesion: 1.0
Nodes (1): Test filter initialization logic.

### Community 49 - "Community 49"
Cohesion: 1.0
Nodes (1): Test when Claude is not available.

### Community 50 - "Community 50"
Cohesion: 1.0
Nodes (1): Test when PR data fetch fails.

### Community 51 - "Community 51"
Cohesion: 1.0
Nodes (1): Test successful audit with no findings.

### Community 52 - "Community 52"
Cohesion: 1.0
Nodes (1): Test successful audit with high severity findings.

### Community 53 - "Community 53"
Cohesion: 1.0
Nodes (1): Test main with full FindingsFilter (LLM-based).

### Community 54 - "Community 54"
Cohesion: 1.0
Nodes (1): Test that filter failure keeps all findings with SimpleFindingsFilter.

### Community 55 - "Community 55"
Cohesion: 1.0
Nodes (1): Test when security audit fails.

### Community 56 - "Community 56"
Cohesion: 1.0
Nodes (1): Test complete workflow with realistic PR data.

### Community 57 - "Community 57"
Cohesion: 1.0
Nodes (1): Test workflow with LLM-based false positive filtering.

### Community 58 - "Community 58"
Cohesion: 1.0
Nodes (1): Test workflow when no security issues are found.

### Community 59 - "Community 59"
Cohesion: 1.0
Nodes (1): Test workflow with very large PR.

### Community 60 - "Community 60"
Cohesion: 1.0
Nodes (1): Test workflow with binary files in PR.

### Community 61 - "Community 61"
Cohesion: 1.0
Nodes (0): 

### Community 62 - "Community 62"
Cohesion: 1.0
Nodes (0): 

### Community 63 - "Community 63"
Cohesion: 1.0
Nodes (0): 

### Community 64 - "Community 64"
Cohesion: 1.0
Nodes (0): 

### Community 65 - "Community 65"
Cohesion: 1.0
Nodes (0): 

### Community 66 - "Community 66"
Cohesion: 1.0
Nodes (0): 

### Community 67 - "Community 67"
Cohesion: 1.0
Nodes (0): 

### Community 68 - "Community 68"
Cohesion: 1.0
Nodes (0): 

### Community 69 - "Community 69"
Cohesion: 1.0
Nodes (0): 

### Community 70 - "Community 70"
Cohesion: 1.0
Nodes (0): 

### Community 71 - "Community 71"
Cohesion: 1.0
Nodes (0): 

### Community 72 - "Community 72"
Cohesion: 1.0
Nodes (0): 

### Community 73 - "Community 73"
Cohesion: 1.0
Nodes (0): 

## Knowledge Gaps
- **159 isolated node(s):** `Claude API client for direct Anthropic API calls.`, `Client for calling Claude API directly for security analysis tasks.`, `Initialize Claude API client.                  Args:             model: Claud`, `Validate that API access is working.                  Returns:             Tu`, `Make Claude API call with retry logic.                  Args:             pro` (+154 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 28`** (2 nodes): `constants.py`, `Constants and configuration values for ClaudeCode.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 29`** (2 nodes): `ObjectPanel.tsx`, `ObjectPanel()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 30`** (2 nodes): `PlayerBoard.tsx`, `PlayerBoard()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 31`** (2 nodes): `StatChip.tsx`, `StatChip()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 32`** (2 nodes): `test-tracking-status-rules.mjs`, `date()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 33`** (2 nodes): `BulkReportModal()`, `BulkReportModal.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 34`** (2 nodes): `KanbanView.jsx`, `KanbanView()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 35`** (2 nodes): `ListView.jsx`, `ListView()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 36`** (2 nodes): `LoginScreen.jsx`, `LoginScreen()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 37`** (2 nodes): `UploadScreen.jsx`, `UploadScreen()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 38`** (2 nodes): `DragHandle.jsx`, `DragHandle()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 39`** (2 nodes): `OperationalToggle.jsx`, `OperationalToggle()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 40`** (2 nodes): `PinIcon.jsx`, `PinIcon()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 41`** (2 nodes): `ShipIcon.jsx`, `ShipIcon()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 42`** (2 nodes): `StatusBadge.jsx`, `StatusBadge()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 43`** (2 nodes): `StatusDropdown.jsx`, `StatusDropdown()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 44`** (1 nodes): `__init__.py`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 45`** (1 nodes): `audit.py`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 46`** (1 nodes): `Test main when GitHub client initialization fails.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 47`** (1 nodes): `Test main when Claude runner initialization fails.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 48`** (1 nodes): `Test filter initialization logic.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 49`** (1 nodes): `Test when Claude is not available.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 50`** (1 nodes): `Test when PR data fetch fails.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 51`** (1 nodes): `Test successful audit with no findings.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 52`** (1 nodes): `Test successful audit with high severity findings.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 53`** (1 nodes): `Test main with full FindingsFilter (LLM-based).`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 54`** (1 nodes): `Test that filter failure keeps all findings with SimpleFindingsFilter.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 55`** (1 nodes): `Test when security audit fails.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 56`** (1 nodes): `Test complete workflow with realistic PR data.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 57`** (1 nodes): `Test workflow with LLM-based false positive filtering.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 58`** (1 nodes): `Test workflow when no security issues are found.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 59`** (1 nodes): `Test workflow with very large PR.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 60`** (1 nodes): `Test workflow with binary files in PR.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 61`** (1 nodes): `vite.config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 62`** (1 nodes): `vitest.config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 63`** (1 nodes): `main.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 64`** (1 nodes): `types.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 65`** (1 nodes): `CardElement.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 66`** (1 nodes): `Hand.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 67`** (1 nodes): `ManaBar.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 68`** (1 nodes): `PlayArea.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 69`** (1 nodes): `eslint.config.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 70`** (1 nodes): `vite.config.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 71`** (1 nodes): `main.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 72`** (1 nodes): `ShipmentCard.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 73`** (1 nodes): `index.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `FindingsFilter` connect `Community 1` to `Community 0`, `Community 9`, `Community 10`, `Community 4`?**
  _High betweenness centrality (0.188) - this node is a cross-community bridge._
- **Why does `SimpleClaudeRunner` connect `Community 4` to `Community 1`, `Community 3`?**
  _High betweenness centrality (0.138) - this node is a cross-community bridge._
- **Why does `sleep()` connect `Community 2` to `Community 10`, `Community 4`?**
  _High betweenness centrality (0.138) - this node is a cross-community bridge._
- **Are the 93 inferred relationships involving `FindingsFilter` (e.g. with `ClaudeAPIClient` and `ConfigurationError`) actually correct?**
  _`FindingsFilter` has 93 INFERRED edges - model-reasoned connections that need verification._
- **Are the 84 inferred relationships involving `HardExclusionRules` (e.g. with `ClaudeAPIClient` and `TestFindingsConversionEdgeCases`) actually correct?**
  _`HardExclusionRules` has 84 INFERRED edges - model-reasoned connections that need verification._
- **Are the 62 inferred relationships involving `SimpleClaudeRunner` (e.g. with `FindingsFilter` and `TestSimpleClaudeRunner`) actually correct?**
  _`SimpleClaudeRunner` has 62 INFERRED edges - model-reasoned connections that need verification._
- **Are the 36 inferred relationships involving `EvaluationEngine` (e.g. with `TestEvalResult` and `TestEvalCase`) actually correct?**
  _`EvaluationEngine` has 36 INFERRED edges - model-reasoned connections that need verification._