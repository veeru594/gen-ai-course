import type { Module } from "../types";

export const foundations: Module = {
  id: "foundations",
  number: "01",
  title: "Generative AI Foundations & LLM Architecture",
  hours: 50,
  tagline:
    "Everything that follows — prompting, model selection, RAG, agents — is better understood by someone who knows how LLMs actually work.",
  intro: [
    "This is the most important module in the curriculum, and it carries the most hours deliberately. Everything that comes after — prompt engineering, model selection, RAG pipelines, agent design, integration architecture — is better understood by someone who knows how Large Language Models actually work than by someone who only knows how to use them.",
    "The objective is not to produce machine learning researchers. The mathematics of attention and the backpropagation behind training are not covered in detail. The objective is practitioners who understand what is happening when they send a prompt and receive a response — deeply enough to make good decisions about constructing prompts, choosing models, designing retrieval systems, and debugging unexpected behaviour.",
    "A common mistake in AI education is teaching people how to use tools without teaching them why those tools behave the way they do. That produces practitioners who can follow tutorials but cannot adapt when things go wrong. This module takes the opposite approach: understanding first, and that understanding makes every tool in every subsequent module easier to use correctly.",
  ],
  sessions: [
    {
      id: "how-llms-work",
      title: "How LLMs Work",
      paragraphs: [
        "At its core, a Large Language Model does one thing: given a sequence of tokens, it predicts the most probable next token. This simple description conceals enormous complexity, but it is also genuinely explanatory — it resolves many puzzles about model behaviour, including why models hallucinate, why they are sensitive to phrasing, and why context window limits matter so much.",
        "Scale has produced surprises that were not predicted from first principles. As models grew from millions to hundreds of billions of parameters, they began exhibiting capabilities smaller models did not have at all — multi-step reasoning, code generation, analogy-making across distant domains. These emergent capabilities were not explicitly trained for; they arose from scale.",
      ],
      topics: [
        {
          topic: "Next-token prediction",
          meaning: "the foundational mechanism behind all LLMs",
        },
        {
          topic: "Transformer architecture",
          meaning: "the 2017 structural innovation that made modern LLMs possible",
        },
        {
          topic: "Attention mechanism",
          meaning:
            "how models weigh which parts of the context are relevant to each prediction",
        },
        {
          topic: "Self- and multi-head attention",
          meaning:
            "processing context in parallel across multiple representation subspaces",
        },
        {
          topic: "Scale and emergence",
          meaning:
            "how more parameters, data, and compute produce qualitatively new abilities",
        },
        {
          topic: "Pre-training",
          meaning: "learning language patterns from massive text corpora",
        },
        {
          topic: "Instruction tuning",
          meaning:
            "fine-tuning on demonstrations so the model follows instructions",
        },
        {
          topic: "RLHF",
          meaning: "shaping behaviour through human preference feedback",
        },
        {
          topic: "Base vs instruction-tuned vs chat models",
          meaning:
            "a base model continues your prompt; a tuned model answers it",
        },
      ],
    },
    {
      id: "tokens-embeddings-params",
      title: "Tokenization, Embeddings, and Model Parameters",
      paragraphs: [
        "Before a model can process text, the text must be converted into numbers. That conversion is tokenization, and understanding it has direct practical consequences: it determines what fits in a context window, why some inputs cost more than others, and why models sometimes behave strangely at word boundaries.",
        "The context window is the most consequential parameter for system design. A model with a 200,000-token window can hold an entire book — or codebase — in a single call; a 4,000-token window cannot hold a long email thread. Whether you need RAG, how you manage conversation history, whether a document fits in one call: all of it follows from this number. Temperature, meanwhile, is not a creativity dial — it is a control over the probability distribution the next token is sampled from.",
      ],
      topics: [
        {
          topic: "Tokenization",
          meaning: "how text is split into subword units before processing",
        },
        {
          topic: "Byte-pair encoding (BPE)",
          meaning:
            "the dominant tokenization algorithm and how it handles uncommon words",
        },
        {
          topic: "Token counts and cost",
          meaning: "the direct relationship between tokenization and API pricing",
        },
        {
          topic: "Context window",
          meaning:
            "the maximum tokens a model can process at once, input plus output",
        },
        {
          topic: "Embeddings",
          meaning: "vector representations that encode semantic relationships",
        },
        {
          topic: "Vector space",
          meaning: "semantic similarity captured as geometric proximity",
        },
        {
          topic: "Vector databases",
          meaning: "systems for storing and querying embeddings at scale",
        },
        {
          topic: "Temperature",
          meaning:
            "controlling the probability distribution over possible next tokens",
        },
        {
          topic: "Top-p (nucleus sampling)",
          meaning:
            "sampling only from tokens whose cumulative probability exceeds p",
        },
        {
          topic: "Max tokens",
          meaning: "capping output length and managing truncation",
        },
        {
          topic: "Stop sequences",
          meaning: "strings that terminate generation when encountered",
        },
        {
          topic: "Frequency / presence penalties",
          meaning: "reducing repetition in extended outputs",
        },
      ],
      code: {
        language: "python",
        label: "semantic_chunking.py",
        code: `def chunk_by_paragraph(text: str, max_chars: int = 1200) -> list[str]:
    """Split on paragraph boundaries, packing paragraphs
    into chunks below max_chars. Topic boundaries beat
    fixed-size cuts for retrieval quality."""
    chunks: list[str] = []
    current = ""
    for para in text.split("\\n\\n"):
        para = para.strip()
        if not para:
            continue
        if len(current) + len(para) > max_chars and current:
            chunks.append(current)
            current = para
        else:
            current = f"{current}\\n\\n{para}" if current else para
    if current:
        chunks.append(current)
    return chunks`,
      },
    },
    {
      id: "prompt-engineering",
      title: "Prompt Engineering",
      paragraphs: [
        "Prompt engineering is a systematic discipline, not an intuitive art. It has known patterns, documented failure modes, and reproducible debugging approaches — and the most important skill is not knowing the patterns but knowing why they work. Zero-shot works for tasks the model already understands. Few-shot demonstrates an unusual format. Chain-of-thought makes the model externalise reasoning steps it would otherwise skip.",
        "Prompts are code. They should be tracked in version control, tested against a consistent evaluation set, and changed deliberately rather than casually. The most common failure mode in AI applications is a prompt change that improves one case while silently breaking three others — detected only after it has affected users.",
      ],
      topics: [
        {
          topic: "Zero-shot prompting",
          meaning: "a task without examples — for tasks the model knows well",
        },
        {
          topic: "Few-shot prompting",
          meaning: "input-output examples that demonstrate the expected pattern",
        },
        {
          topic: "Chain-of-thought",
          meaning: "instructing models to reason step by step before answering",
        },
        {
          topic: "System prompts",
          meaning:
            "role, tone, constraints, and output format set at the conversation level",
        },
        {
          topic: "Structured output prompting",
          meaning: "reliably getting JSON, tables, and formatted content",
        },
        {
          topic: "Prompt chaining",
          meaning:
            "breaking complex tasks into sequences of simpler, reliable prompts",
        },
        {
          topic: "Negative prompting",
          meaning: "specifying what not to do as explicitly as what to do",
        },
        {
          topic: "Role and persona definition",
          meaning: "how explicit role assignment changes model behaviour",
        },
        {
          topic: "Common failure patterns",
          meaning:
            "vague instructions, conflicting constraints, ambiguous format requests",
        },
        {
          topic: "Debugging prompts",
          meaning: "identifying why a prompt fails and iterating systematically",
        },
        {
          topic: "Prompt versioning",
          meaning: "tracking changes and measuring the impact of modifications",
        },
        {
          topic: "Prompt injection",
          meaning: "how malicious inputs can subvert prompt instructions",
        },
      ],
    },
    {
      id: "rag",
      title: "Retrieval Augmented Generation (RAG)",
      paragraphs: [
        "Every model has a knowledge cutoff, and every model has a tendency to hallucinate. RAG is the primary architectural answer to both: rather than relying on what the model memorised during training, retrieve relevant information from an external source at query time and hand it to the model as context alongside the question.",
        "A RAG pipeline is a series of design decisions, each affecting quality. How documents are chunked affects retrieval. How embeddings are generated affects what similarity can be detected. How retrieval is configured affects whether the most relevant chunks actually return. How retrieved context is presented affects how well the model uses it.",
      ],
      topics: [
        {
          topic: "Knowledge cutoff",
          meaning:
            "why models cannot know what happened after their training data",
        },
        {
          topic: "Hallucination",
          meaning:
            "plausible-sounding false information, and when it is most likely",
        },
        {
          topic: "RAG architecture",
          meaning: "the end-to-end pipeline from ingestion to grounded response",
        },
        {
          topic: "Chunking strategies",
          meaning: "fixed-size, sentence, semantic, hierarchical, recursive",
        },
        {
          topic: "Embedding documents",
          meaning: "converting chunks into vectors for similarity retrieval",
        },
        {
          topic: "Indexing",
          meaning: "storing embeddings in a vector database for efficient query",
        },
        {
          topic: "Retrieval",
          meaning: "finding the most relevant chunks via embedding similarity",
        },
        {
          topic: "Hybrid retrieval",
          meaning: "vector similarity plus keyword search for better recall",
        },
        {
          topic: "Reranking",
          meaning: "a secondary model reorders retrieved chunks by relevance",
        },
        {
          topic: "Augmentation",
          meaning: "constructing the final prompt from context plus query",
        },
        {
          topic: "RAG evaluation",
          meaning: "retrieval precision, answer faithfulness, answer relevance",
        },
        {
          topic: "Failure modes",
          meaning: "retrieval misses, context overflow, conflicting chunks",
        },
        {
          topic: "RAG vs fine-tuning",
          meaning: "making the right architectural choice for the use case",
        },
      ],
    },
    {
      id: "finetuning-multimodal-ethics",
      title: "Fine-Tuning, Multimodal AI, Evaluation, and Ethics",
      paragraphs: [
        "Four interconnected topics complete the foundational picture. Fine-tuning is an architectural option with specific trade-offs, not a universal improvement over prompting. Multimodal AI extends the same understanding to images, audio, and video. Evaluation is the discipline of measuring whether AI systems actually perform well. Ethics grounds the technical content in the real-world consequences of deploying these systems.",
      ],
      topics: [
        {
          topic: "Fine-tuning",
          meaning: "adjusting weights on a task-specific dataset to specialise",
        },
        {
          topic: "When fine-tuning is justified",
          meaning:
            "consistent format needs, large labelled datasets, exhausted prompting",
        },
        {
          topic: "When it is not",
          meaning: "small datasets, changing requirements, unclear evaluation",
        },
        {
          topic: "Text-to-image",
          meaning: "how diffusion models generate images from prompts",
        },
        {
          topic: "Image-to-text",
          meaning: "vision encoders describing and understanding visual content",
        },
        {
          topic: "Document understanding",
          meaning: "structured extraction from PDFs, forms, and screenshots",
        },
        {
          topic: "Text-to-speech / speech-to-text",
          meaning: "neural synthesis quality, transcription accuracy, latency",
        },
        {
          topic: "Model evaluation",
          meaning:
            "accuracy, consistency, hallucination rate, latency, cost, format compliance",
        },
        {
          topic: "Bias",
          meaning: "how training-data biases surface in outputs",
        },
        {
          topic: "Data privacy",
          meaning: "what should and should not enter model context",
        },
        {
          topic: "Responsible deployment",
          meaning: "output filtering, guardrails, human-in-the-loop checkpoints",
        },
      ],
    },
  ],
  demos: [
    {
      id: "tokenizer",
      title: "See your text the way the model does",
      lede: "Paste anything. Watch it split into tokens, count them, and price them. The intuition you build here explains context limits and API bills for the rest of the program.",
      afterSession: 1,
    },
    {
      id: "embeddings",
      title: "Meaning becomes geometry",
      lede: "Every term below is placed by how it's used across this curriculum — related ideas end up close together. Click one to see its nearest neighbours by cosine similarity. This is the intuition behind embeddings, vector space, and the retrieval that follows.",
      afterSession: 1,
    },
    {
      id: "temperature",
      title: "Temperature is not a creativity dial",
      lede: "Eight candidate tokens, fixed logits, one slider. Watch the probability distribution reshape live, then sample from it. Low T always says Paris. High T gets weird — and that moment is the lesson.",
      afterSession: 2,
    },
    {
      id: "rag",
      title: "Watch retrieval ground an answer",
      lede: "Ask a question. Watch it embed, retrieve the most relevant curriculum passages by similarity, and assemble the augmented prompt an LLM would answer from. Retrieval is real — it reuses the embeddings above to match meaning, not keywords.",
      afterSession: 3,
    },
  ],
  concepts: [
    {
      term: "Transformer",
      definition:
        "The neural network architecture behind every major language model, built on attention mechanisms.",
    },
    {
      term: "Attention Mechanism",
      definition:
        "The component of a Transformer that lets the model weigh the relevance of each token when predicting the next.",
    },
    {
      term: "Embedding",
      definition:
        "A numerical vector representation of a token or text that encodes its semantic meaning.",
    },
    {
      term: "Vector Database",
      definition:
        "A database optimised for storing and querying high-dimensional vectors, used in RAG and semantic search.",
    },
    {
      term: "RAG",
      definition:
        "Retrieval Augmented Generation — grounding model responses with information retrieved from external sources at query time.",
    },
    {
      term: "Hallucination",
      definition:
        "When a model generates information that sounds plausible but is factually incorrect.",
    },
    {
      term: "Context Window",
      definition:
        "The maximum amount of text, measured in tokens, that a model can process in a single call.",
    },
    {
      term: "Chunking",
      definition:
        "Splitting documents into smaller pieces for embedding and retrieval in a RAG pipeline.",
    },
    {
      term: "RLHF",
      definition:
        "Reinforcement Learning from Human Feedback — training that shapes model behaviour using human preference ratings.",
    },
    {
      term: "Temperature",
      definition:
        "A parameter controlling output randomness by adjusting the token probability distribution.",
    },
    {
      term: "Instruction Tuning",
      definition:
        "Fine-tuning a base model on instruction-response pairs so it follows natural-language directions.",
    },
    {
      term: "Semantic Chunking",
      definition:
        "A chunking strategy that splits documents on topic boundaries rather than fixed character counts.",
    },
    {
      term: "Prompt Caching",
      definition:
        "Reusing computation for repeated prompt prefixes, reducing latency and cost.",
    },
  ],
  exercises: [
    {
      id: "f-ex1",
      level: "STARTER",
      text: "Write a prompt that extracts structured JSON from an unstructured customer complaint — name, product, issue, urgency. Test it on five complaints and evaluate consistency.",
    },
    {
      id: "f-ex2",
      level: "BUILD",
      text: "Design a simple RAG pipeline with LlamaIndex: ingest a 10-page PDF, chunk it, embed it, and build a query interface that retrieves relevant sections and generates an answer.",
    },
    {
      id: "f-ex3",
      level: "STARTER",
      text: "Run the same complex reasoning task across GPT-4o, Claude, and Gemini. Document how each model approaches the problem differently.",
    },
    {
      id: "f-ex4",
      level: "BUILD",
      text: "Create a prompt evaluation rubric with five criteria and use it to systematically compare five prompts for the same task. Document what changed and what effect each change had.",
    },
    {
      id: "f-ex5",
      level: "SHIP",
      text: "Build a prompt that reliably extracts a six-field JSON object from varied unstructured invoice texts. Test on ten invoice formats and measure field extraction accuracy.",
    },
    {
      id: "f-ex6",
      level: "SHIP",
      text: "Implement a semantic chunking function in Python that splits on paragraph boundaries, embeds each chunk with the OpenAI embeddings API, and stores results in a local ChromaDB instance.",
    },
  ],
  resources: [
    {
      label: "OpenAI Tokenizer",
      url: "https://platform.openai.com/tokenizer",
      purpose: "paste text, see real BPE tokens and counts",
      module: "foundations",
    },
    {
      label: "Attention Is All You Need",
      url: "https://arxiv.org/abs/1706.03762",
      purpose: "the 2017 paper that introduced the Transformer",
      module: "foundations",
    },
    {
      label: "The Illustrated Transformer",
      url: "https://jalammar.github.io/illustrated-transformer/",
      purpose: "the clearest visual walkthrough of attention ever written",
      module: "foundations",
    },
    {
      label: "Anthropic Prompt Engineering Guide",
      url: "https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/overview",
      purpose: "official patterns: system prompts, few-shot, chain-of-thought",
      module: "foundations",
    },
    {
      label: "ChromaDB Docs",
      url: "https://docs.trychroma.com/",
      purpose: "run a local vector database in four lines of Python",
      module: "foundations",
    },
    {
      label: "Pinecone Learn",
      url: "https://www.pinecone.io/learn/",
      purpose: "embeddings, vector search, and RAG explained from zero",
      module: "foundations",
    },
    {
      label: "Anthropic Docs — Models Overview",
      url: "https://docs.claude.com/en/docs/about-claude/models/overview",
      purpose: "context windows, capabilities, and pricing per Claude tier",
      module: "foundations",
    },
  ],
};
