import type { Module } from "../types";

export const models: Module = {
  id: "models",
  number: "03",
  title: "Generative AI Models & Tool Exploration",
  hours: 35,
  tagline:
    "Three model families cover every capability category in the market. Learn them deeply, and every new release becomes easy to evaluate.",
  intro: [
    "The Generative AI tool landscape changes faster than any curriculum can track. New models release monthly. Capabilities expand, prices drop, and the relative strengths of providers shift. A curriculum that attempts to cover every tool in detail will be outdated before it is delivered.",
    "This module takes a different approach. Rather than cataloguing tools, it builds proficiency with the three model families that define the current landscape — Claude, OpenAI, and Gemini — which between them cover every capability category in the market. A participant who understands these three deeply can evaluate any new model against what they already know. ElevenLabs is added as the specialist for voice and audio — the one capability none of the three families covers adequately.",
    "The module closes with structured tool exploration: identify a new tool, assess it against a framework, use it for a real task, present findings. That habit — not any specific tool knowledge — is what keeps a practitioner current in a field that will not stop moving.",
  ],
  sessions: [
    {
      id: "claude",
      title: "Claude (Anthropic)",
      paragraphs: [
        "Claude is Anthropic's model family, distinguished by long-context capability, careful instruction following, and strength in document analysis and structured output. It also has the most thoughtfully designed approach to extended reasoning — Extended Thinking lets Claude reason through complex problems before answering, transparently and inspectably.",
        "The family spans three tiers: Haiku for speed and cost, Sonnet for the balance that fits most production use, Opus for the most demanding tasks where quality outweighs latency and cost. Knowing when the cost of Opus is justified is a practical skill that affects both the quality and the economics of every AI system you build.",
      ],
      topics: [
        {
          topic: "Model family",
          meaning: "Haiku, Sonnet, Opus — capability and cost positioning",
        },
        {
          topic: "Strengths",
          meaning:
            "long-context retention, structured output, document analysis",
        },
        {
          topic: "Extended Thinking",
          meaning: "how it works, when to enable it, latency and cost implications",
        },
        {
          topic: "Vision capabilities",
          meaning: "images, PDFs, and screenshots as model inputs",
        },
        {
          topic: "API structure",
          meaning: "messages format, system prompt, tool definitions, streaming",
        },
        {
          topic: "Prompt caching",
          meaning: "cheaper, faster calls when large context repeats",
        },
        {
          topic: "Constitutional AI",
          meaning: "how Anthropic's training philosophy shapes Claude's behaviour",
        },
        {
          topic: "Use cases",
          meaning: "document Q&A, structured extraction, code review, long-form",
        },
        {
          topic: "Limitations",
          meaning: "where Claude is less suited and when to consider switching",
        },
      ],
    },
    {
      id: "openai",
      title: "OpenAI (GPT Models and Reasoning)",
      paragraphs: [
        "OpenAI's family is the most widely deployed in the world and the de facto reference point. GPT-4o is the mainstream: a capable multimodal model with strong function calling and reliable structured output. The o-series (o1, o3) is architecturally different — these models generate a chain of reasoning first, then respond. Substantially more capable on multi-step logic; significantly slower and more expensive.",
        "Function calling is OpenAI's most mature tool-integration feature and the one most production systems are built on: instead of asking the model to format a tool call as text and parsing it, you receive a structured, typed invocation. Structured output mode goes further — guaranteeing the response conforms to a provided JSON schema, eliminating an entire category of parsing failures.",
      ],
      topics: [
        {
          topic: "Model family",
          meaning: "GPT-4o and GPT-4o mini — capability and cost characteristics",
        },
        {
          topic: "Multimodal inputs",
          meaning: "text, image, and audio in a single request",
        },
        {
          topic: "Function calling",
          meaning: "defining tools, receiving call requests, returning results",
        },
        {
          topic: "Structured output mode",
          meaning: "guaranteed JSON schema adherence without prompt tricks",
        },
        {
          topic: "o1 and o3",
          meaning: "reasoning models — architecturally distinct from GPT-4o",
        },
        {
          topic: "When to use reasoning models",
          meaning: "multi-step logic, complex planning, mathematical reasoning",
        },
        {
          topic: "Cost / latency trade-off",
          meaning: "reasoning models are slower and pricier — budget accordingly",
        },
        {
          topic: "API structure",
          meaning: "chat completions, developer and system roles, streaming",
        },
        {
          topic: "Assistants API",
          meaning: "file retrieval, code interpreter, stateful conversations",
        },
      ],
    },
    {
      id: "gemini",
      title: "Gemini (Google DeepMind)",
      paragraphs: [
        "Gemini represents a genuinely different design philosophy. Where GPT-4o and Claude were primarily text models that gained multimodal abilities over time, Gemini was designed natively multimodal — text, image, audio, and video as first-class inputs from the start.",
        "Its context window is exceptionally large, and that changes what is architecturally possible. A legal review that compares clauses across a 500-page contract would normally require chunking, embedding, retrieval — a RAG pipeline with real engineering overhead. With Gemini's window, the entire document goes in one call. And video understanding currently has no serious competitor among general-purpose models: submit a meeting recording, extract the action items.",
      ],
      topics: [
        {
          topic: "Model family",
          meaning: "Flash (speed), Pro (balanced), Ultra (maximum capability)",
        },
        {
          topic: "Native multimodality",
          meaning: "text, image, audio, video as first-class input types",
        },
        {
          topic: "Context window",
          meaning: "industry-leading size — entire books and codebases in one call",
        },
        {
          topic: "Gemini Thinking",
          meaning: "extended reasoning, compared with o1 and Extended Thinking",
        },
        {
          topic: "Search grounding",
          meaning: "real-time Google Search retrieval inside generation",
        },
        {
          topic: "AI Studio vs Vertex AI",
          meaning: "the two deployment paths and their different audiences",
        },
        {
          topic: "API structure",
          meaning: "Google AI SDK, request format, multimodal input construction",
        },
        {
          topic: "Use cases",
          meaning: "large documents, video understanding, grounded generation",
        },
        {
          topic: "Workspace integration",
          meaning: "Docs, Sheets, Drive, Gmail native AI features",
        },
      ],
    },
    {
      id: "elevenlabs",
      title: "ElevenLabs (Voice and Audio Generation)",
      paragraphs: [
        "Voice and audio generation is the one significant capability category the three major families do not cover adequately. ElevenLabs is the specialist leader — voice quality, cloning capability, and API accessibility that significantly exceed what general-purpose models offer for voice-specific applications.",
        "The practical applications in automation workflows are real: customer-facing audio output, content pipelines that produce podcast-format summaries, accessibility tools converting text to natural speech, and voiceover generation for video.",
      ],
      topics: [
        {
          topic: "Text-to-speech",
          meaning: "written content to natural-sounding spoken audio",
        },
        {
          topic: "Voice library",
          meaning: "pre-built voices across languages and styles",
        },
        {
          topic: "Voice cloning",
          meaning: "a custom voice from a sample recording",
        },
        {
          topic: "Multilingual synthesis",
          meaning: "natural pronunciation across languages",
        },
        {
          topic: "Voice design",
          meaning: "stability, clarity, and style-exaggeration controls",
        },
        {
          topic: "API integration",
          meaning: "calling ElevenLabs from Python and automation workflows",
        },
        {
          topic: "Output formats",
          meaning: "MP3, PCM, streaming audio for different delivery contexts",
        },
        {
          topic: "Latency and streaming",
          meaning: "real-time generation for interactive applications",
        },
        {
          topic: "Cost structure",
          meaning: "per-character pricing and estimating production costs",
        },
      ],
    },
    {
      id: "comparison",
      title: "Model Comparison and Tool Exploration",
      paragraphs: [
        "With hands-on experience across all four providers, participants can now make principled comparisons. This session formalises the comparison framework — capability, cost, speed, context, API surface — then turns participants loose on independent exploration: evaluate an emerging tool, use it for a real task, present findings to peers.",
        "Production systems often use more than one model family on purpose: a cheap fast model for high-volume classification, an expensive one only when confidence is low. Multi-provider strategy is a design skill, not a compromise.",
      ],
      topics: [
        {
          topic: "Capability comparison",
          meaning: "what each family leads on, where each has known limits",
        },
        {
          topic: "Reasoning model comparison",
          meaning: "o-series vs Extended Thinking vs Gemini Thinking",
        },
        {
          topic: "Cost and speed",
          meaning: "matching model tier to task requirements and budget",
        },
        {
          topic: "Context window comparison",
          meaning: "when size changes what is architecturally possible",
        },
        {
          topic: "API surface comparison",
          meaning: "what changes when switching providers, what stays constant",
        },
        {
          topic: "Multi-provider strategy",
          meaning: "why production systems mix model families deliberately",
        },
        {
          topic: "Exploration framework",
          meaning: "capability, API, use-case fit, pricing, limitations, community",
        },
        {
          topic: "The evaluation habit",
          meaning: "staying current in a field that will not stop moving",
        },
      ],
    },
  ],
  demos: [
    {
      id: "model-matrix",
      title: "Pick the task, watch the ranking change",
      lede: "There is no best model — only a best model for the task in front of you. Switch tasks below and watch capability-fit, cost, and latency re-score live.",
      afterSession: 4,
    },
  ],
  concepts: [
    {
      term: "Extended Thinking",
      definition:
        "Claude's mode for reasoning through a problem before answering — transparent, inspectable, and paid for in latency and tokens.",
    },
    {
      term: "Reasoning Model",
      definition:
        "A model (o1, o3) that generates an internal chain of reasoning before responding — stronger on multi-step logic, slower and costlier.",
    },
    {
      term: "Structured Output Mode",
      definition:
        "An OpenAI feature guaranteeing the response conforms to a provided JSON schema, eliminating parsing failures.",
    },
    {
      term: "Native Multimodality",
      definition:
        "A model designed from the ground up to accept text, image, audio, and video — not a text model with add-ons.",
    },
    {
      term: "Search Grounding",
      definition:
        "Gemini's integration of real-time Google Search results into generation, countering the knowledge cutoff.",
    },
    {
      term: "Model Tier",
      definition:
        "A position in a family's capability/cost ladder — Haiku/Sonnet/Opus, GPT-4o mini/GPT-4o, Flash/Pro/Ultra.",
    },
    {
      term: "Voice Cloning",
      definition:
        "Creating a custom synthetic voice from a sample recording of a real speaker.",
    },
    {
      term: "Multi-Provider Strategy",
      definition:
        "Deliberately using different model families for different workflow steps based on capability, cost, and latency.",
    },
    {
      term: "Prompt Caching",
      definition:
        "Reusing computation for repeated prompt prefixes — a major cost lever for workflows with large shared context.",
    },
  ],
  exercises: [
    {
      id: "m-ex1",
      level: "STARTER",
      text: "Run the same complex writing task through Claude Sonnet, GPT-4o, and Gemini Pro. Score each output on five criteria and document which performed best and why.",
    },
    {
      id: "m-ex2",
      level: "BUILD",
      text: "Call the ElevenLabs API from Python to convert a 500-word article into audio. Try three different voices and document the differences in quality and character.",
    },
    {
      id: "m-ex3",
      level: "BUILD",
      text: "Find a newly released AI tool not covered in the curriculum. Evaluate it with the five-point framework — capability, API, use case, pricing, limitations — and present your findings.",
    },
    {
      id: "m-ex4",
      level: "SHIP",
      text: "Design a multi-provider content pipeline: which model drafts, which edits, which voices it? Justify every choice on capability and cost.",
    },
    {
      id: "m-ex5",
      level: "BUILD",
      text: "Submit the same 50-page document to Claude and Gemini with the same question. Compare quality, accuracy, and completeness; document where each excels.",
    },
    {
      id: "m-ex6",
      level: "SHIP",
      text: "Run the same multi-step reasoning problem through Claude Extended Thinking and o1. Compare the reasoning traces, final answers, latency, and token cost.",
    },
  ],
  resources: [
    {
      label: "Claude API Docs",
      url: "https://docs.claude.com/",
      purpose: "messages API, Extended Thinking, vision, prompt caching",
      module: "models",
    },
    {
      label: "OpenAI Platform Docs",
      url: "https://platform.openai.com/docs/",
      purpose: "chat completions, function calling, structured output mode",
      module: "models",
    },
    {
      label: "Google AI for Developers",
      url: "https://ai.google.dev/",
      purpose: "Gemini API, long context, multimodal input construction",
      module: "models",
    },
    {
      label: "ElevenLabs Docs",
      url: "https://elevenlabs.io/docs",
      purpose: "TTS API, voice settings, streaming audio formats",
      module: "models",
    },
    {
      label: "Google AI Studio",
      url: "https://aistudio.google.com/",
      purpose: "test Gemini against your own prompts, free, in the browser",
      module: "models",
    },
    {
      label: "OpenAI API Pricing",
      url: "https://platform.openai.com/docs/pricing",
      purpose: "the per-token numbers behind every cost decision",
      module: "models",
    },
    {
      label: "Anthropic Models Overview",
      url: "https://docs.claude.com/en/docs/about-claude/models/overview",
      purpose: "Haiku vs Sonnet vs Opus — context, capability, price per tier",
      module: "models",
    },
  ],
};
