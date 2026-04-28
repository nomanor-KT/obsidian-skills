# Graph Report - C:\Users\k.torebko\Desktop\KarolOS\Obsidian\Karol-KB  (2026-04-18)

## Corpus Check
- 4 files · ~132,126 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 61 nodes · 71 edges · 22 communities detected
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
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

## God Nodes (most connected - your core abstractions)
1. `main()` - 9 edges
2. `main()` - 9 edges
3. `setup_azure_credentials()` - 3 edges
4. `load_document()` - 3 edges
5. `split_documents()` - 3 edges
6. `create_vectorstore()` - 3 edges
7. `create_retriever()` - 3 edges
8. `create_rag_chain()` - 3 edges
9. `ask_question()` - 3 edges
10. `get_api_key()` - 3 edges

## Surprising Connections (you probably didn't know these)
- `main()` --calls--> `load_document()`  [EXTRACTED]
  C:\Users\k.torebko\Desktop\KarolOS\Obsidian\Karol-KB\studia\AI Lider\aganie\langchainex_rag\1langchain_rag_tutorial copy.py → C:\Users\k.torebko\Desktop\KarolOS\Obsidian\Karol-KB\studia\AI Lider\aganie\langchainex_rag\1langchain_rag_tutorial copy.py  _Bridges community 7 → community 2_
- `main()` --calls--> `split_documents()`  [EXTRACTED]
  C:\Users\k.torebko\Desktop\KarolOS\Obsidian\Karol-KB\studia\AI Lider\aganie\langchainex_rag\1langchain_rag_tutorial copy.py → C:\Users\k.torebko\Desktop\KarolOS\Obsidian\Karol-KB\studia\AI Lider\aganie\langchainex_rag\1langchain_rag_tutorial copy.py  _Bridges community 9 → community 2_
- `main()` --calls--> `create_vectorstore()`  [EXTRACTED]
  C:\Users\k.torebko\Desktop\KarolOS\Obsidian\Karol-KB\studia\AI Lider\aganie\langchainex_rag\1langchain_rag_tutorial copy.py → C:\Users\k.torebko\Desktop\KarolOS\Obsidian\Karol-KB\studia\AI Lider\aganie\langchainex_rag\1langchain_rag_tutorial copy.py  _Bridges community 1 → community 2_
- `main()` --calls--> `create_retriever()`  [EXTRACTED]
  C:\Users\k.torebko\Desktop\KarolOS\Obsidian\Karol-KB\studia\AI Lider\aganie\langchainex_rag\1langchain_rag_tutorial copy.py → C:\Users\k.torebko\Desktop\KarolOS\Obsidian\Karol-KB\studia\AI Lider\aganie\langchainex_rag\1langchain_rag_tutorial copy.py  _Bridges community 11 → community 2_
- `main()` --calls--> `create_rag_chain()`  [EXTRACTED]
  C:\Users\k.torebko\Desktop\KarolOS\Obsidian\Karol-KB\studia\AI Lider\aganie\langchainex_rag\1langchain_rag_tutorial copy.py → C:\Users\k.torebko\Desktop\KarolOS\Obsidian\Karol-KB\studia\AI Lider\aganie\langchainex_rag\1langchain_rag_tutorial copy.py  _Bridges community 10 → community 2_

## Communities

### Community 0 - "Community 0"
Cohesion: 0.22
Nodes (8): get_weather(), get_word_length(), multiply(), Run the agent and return the final answer.          When verbose=True, prints, Get the current weather for a given city. Returns a short weather description., Multiply two integers together and return the result., Returns the number of characters in a word., run_agent()

### Community 1 - "Community 1"
Cohesion: 0.5
Nodes (3): create_vectorstore(), RAG (Retrieval Augmented Generation) Tutorial with LangChain & Azure OpenAI ===, Create a vector store from document chunks.          Process:     1. Each chu

### Community 2 - "Community 2"
Cohesion: 0.5
Nodes (4): main(), Main function demonstrating the complete RAG pipeline., Set up Azure authentication using DefaultAzureCredential.     This supports mul, setup_azure_credentials()

### Community 3 - "Community 3"
Cohesion: 0.5
Nodes (4): create_rag_chain(), main(), Build the RAG chain that combines retrieval and generation.          Chain flo, Main function demonstrating the complete RAG pipeline.

### Community 4 - "Community 4"
Cohesion: 0.5
Nodes (3): get_api_key(), RAG (Retrieval Augmented Generation) Tutorial with LangChain & Azure OpenAI ===, Get the API key for Azure OpenAI from environment variables.          Returns:

### Community 5 - "Community 5"
Cohesion: 0.67
Nodes (3): AgentState, The state that persists throughout the agent's execution.          messages: T, TypedDict

### Community 6 - "Community 6"
Cohesion: 0.67
Nodes (2): get_weather(), Get the current weather for a given city. Returns a short weather description.

### Community 7 - "Community 7"
Cohesion: 1.0
Nodes (2): load_document(), Load a document from a web URL.          We use BeautifulSoup to parse only th

### Community 8 - "Community 8"
Cohesion: 1.0
Nodes (2): ask_question(), Ask a question using the RAG chain.          Args:         rag_chain: The RAG

### Community 9 - "Community 9"
Cohesion: 1.0
Nodes (2): Split documents into smaller chunks for embedding.          Why chunk?     -, split_documents()

### Community 10 - "Community 10"
Cohesion: 1.0
Nodes (2): create_rag_chain(), Build the RAG chain that combines retrieval and generation.          Chain flo

### Community 11 - "Community 11"
Cohesion: 1.0
Nodes (2): create_retriever(), Create a retriever from the vector store.          The retriever finds the k m

### Community 12 - "Community 12"
Cohesion: 1.0
Nodes (2): ask_question(), Ask a question using the RAG chain.          Args:         rag_chain: The RAG

### Community 13 - "Community 13"
Cohesion: 1.0
Nodes (2): Split documents into smaller chunks for embedding.          Why chunk?     -, split_documents()

### Community 14 - "Community 14"
Cohesion: 1.0
Nodes (2): load_document(), Load a document from a web URL.          We use BeautifulSoup to parse only th

### Community 15 - "Community 15"
Cohesion: 1.0
Nodes (2): create_vectorstore(), Create a vector store from document chunks.          Process:     1. Each chu

### Community 16 - "Community 16"
Cohesion: 1.0
Nodes (2): create_retriever(), Create a retriever from the vector store.          The retriever finds the k m

### Community 17 - "Community 17"
Cohesion: 1.0
Nodes (2): multiply(), Multiply two integers together and return the result.

### Community 18 - "Community 18"
Cohesion: 1.0
Nodes (2): Decide whether to continue to tools or end the conversation.          - If the, should_continue()

### Community 19 - "Community 19"
Cohesion: 1.0
Nodes (2): agent_node(), The 'agent' node: calls the LLM to decide what to do next.          The LLM wi

### Community 20 - "Community 20"
Cohesion: 1.0
Nodes (2): Run the agent with a question and return the final answer.          This invok, run_agent()

### Community 21 - "Community 21"
Cohesion: 1.0
Nodes (2): get_word_length(), Returns the number of characters in a word.

## Knowledge Gaps
- **29 isolated node(s):** `RAG (Retrieval Augmented Generation) Tutorial with LangChain & Azure OpenAI ===`, `Set up Azure authentication using DefaultAzureCredential.     This supports mul`, `Load a document from a web URL.          We use BeautifulSoup to parse only th`, `Split documents into smaller chunks for embedding.          Why chunk?     -`, `Create a vector store from document chunks.          Process:     1. Each chu` (+24 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 7`** (2 nodes): `load_document()`, `Load a document from a web URL.          We use BeautifulSoup to parse only th`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 8`** (2 nodes): `ask_question()`, `Ask a question using the RAG chain.          Args:         rag_chain: The RAG`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 9`** (2 nodes): `Split documents into smaller chunks for embedding.          Why chunk?     -`, `split_documents()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 10`** (2 nodes): `create_rag_chain()`, `Build the RAG chain that combines retrieval and generation.          Chain flo`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 11`** (2 nodes): `create_retriever()`, `Create a retriever from the vector store.          The retriever finds the k m`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 12`** (2 nodes): `ask_question()`, `Ask a question using the RAG chain.          Args:         rag_chain: The RAG`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 13`** (2 nodes): `Split documents into smaller chunks for embedding.          Why chunk?     -`, `split_documents()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 14`** (2 nodes): `load_document()`, `Load a document from a web URL.          We use BeautifulSoup to parse only th`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 15`** (2 nodes): `create_vectorstore()`, `Create a vector store from document chunks.          Process:     1. Each chu`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 16`** (2 nodes): `create_retriever()`, `Create a retriever from the vector store.          The retriever finds the k m`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 17`** (2 nodes): `multiply()`, `Multiply two integers together and return the result.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 18`** (2 nodes): `Decide whether to continue to tools or end the conversation.          - If the`, `should_continue()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 19`** (2 nodes): `agent_node()`, `The 'agent' node: calls the LLM to decide what to do next.          The LLM wi`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 20`** (2 nodes): `Run the agent with a question and return the final answer.          This invok`, `run_agent()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 21`** (2 nodes): `get_word_length()`, `Returns the number of characters in a word.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `main()` connect `Community 2` to `Community 1`, `Community 7`, `Community 8`, `Community 9`, `Community 10`, `Community 11`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Why does `main()` connect `Community 3` to `Community 4`, `Community 12`, `Community 13`, `Community 14`, `Community 15`, `Community 16`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Why does `AgentState` connect `Community 5` to `Community 6`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **What connects `RAG (Retrieval Augmented Generation) Tutorial with LangChain & Azure OpenAI ===`, `Set up Azure authentication using DefaultAzureCredential.     This supports mul`, `Load a document from a web URL.          We use BeautifulSoup to parse only th` to the rest of the system?**
  _29 weakly-connected nodes found - possible documentation gaps or missing edges._