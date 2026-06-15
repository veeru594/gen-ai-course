import type { ModuleId } from "./types";
import { programHours } from "./modules";

/* The 90-day delivery calendar, sequenced in curriculum order
   (Module 01 → 05, then the integration capstone). Each working day
   runs a fixed time grid — a morning Domain concept, an Aptitude hour,
   lunch, a Soft-Skills hour, then an afternoon Lab that builds the
   morning by hand.

   The Domain + Lab content advances in module order. The Aptitude and
   Soft-Skills tracks (the employability programme) run on their own
   progression against the calendar — foundational aptitude and
   orientation early, interview preparation and revision late — so they
   stay fixed to the day rather than moving with the modules. */

export type BlockKind = ModuleId | "capstone";

export interface ScheduleDay {
  day: number;
  weekend: boolean;
  domain?: string;
  aptitude?: string;
  softSkill?: string;
  lab?: string;
}

export interface ScheduleBlock {
  kind: BlockKind;
  /** module used for colour + the "view module" link */
  module: ModuleId;
  number: string;
  name: string;
  part: string;
  blurb: string;
  focus: string[];
  /** inclusive day range (teaching span) */
  from: number;
  to: number;
}

/* The fixed daily rhythm — identical every working day. mins drives the
   proportional time-column on the page. */
export const dayGrid = [
  { key: "domain", label: "Domain", start: "09:30", end: "12:00", mins: 150, tone: "teach" },
  { key: "aptitude", label: "Aptitude", start: "12:00", end: "13:00", mins: 60, tone: "side" },
  { key: "lunch", label: "Lunch", start: "13:00", end: "14:00", mins: 60, tone: "break" },
  { key: "softSkill", label: "Soft Skills", start: "14:00", end: "15:00", mins: 60, tone: "side" },
  { key: "lab", label: "Lab", start: "15:00", end: "17:30", mins: 150, tone: "teach" },
] as const;

export type DayGridKey = (typeof dayGrid)[number]["key"];

export const scheduleBlocks: ScheduleBlock[] = [
  {
    kind: "foundations",
    module: "foundations",
    number: "01",
    name: "GenAI Foundations",
    part: "Module 01 — Foundations & LLM Architecture",
    blurb:
      "How the machine actually works: from next-token prediction and attention through tokenization, embeddings, prompting, RAG, and the ethics of deploying it.",
    focus: [
      "Transformers, attention & training stages",
      "Tokenization, embeddings & vector search",
      "Prompt engineering & structured output",
      "RAG, fine-tuning, multimodal & ethics",
    ],
    from: 1,
    to: 27,
  },
  {
    kind: "automation",
    module: "automation",
    number: "02",
    name: "Automation Platforms",
    part: "Module 02 — AI Automation Platforms",
    blurb:
      "Workflow automation that survives failure: Make.com and n8n from first scenario to production, with architecture, monitoring, and handover.",
    focus: [
      "Triggers, actions, conditions & failure design",
      "Make.com scenarios end-to-end",
      "n8n from canvas to production",
      "Architecture, documentation & handover",
    ],
    from: 29,
    to: 41,
  },
  {
    kind: "models",
    module: "models",
    number: "03",
    name: "Models & Tools",
    part: "Module 03 — Models & Tool Exploration",
    blurb:
      "Hands-on across the frontier labs — Claude, GPT-4o, Gemini, ElevenLabs — building a repeatable framework for choosing the right model per task.",
    focus: [
      "Claude, GPT-4o, Gemini & ElevenLabs hands-on",
      "Reasoning models vs standard generation",
      "Function calling & structured output modes",
      "A repeatable model-selection framework",
    ],
    from: 43,
    to: 55,
  },
  {
    kind: "agents",
    module: "agents",
    number: "04",
    name: "Agentic Frameworks",
    part: "Module 04 — Agentic AI Frameworks",
    blurb:
      "From a single agent loop to multi-agent systems: tool use, memory, LangChain, LangGraph, LlamaIndex, and building a Model Context Protocol server.",
    focus: [
      "Agent loop, ReAct & tool use",
      "Memory systems & function-calling agents",
      "LangChain, LangGraph & multi-agent supervision",
      "LlamaIndex & custom MCP servers",
    ],
    from: 57,
    to: 69,
  },
  {
    kind: "python",
    module: "python",
    number: "05",
    name: "Python Foundation",
    part: "Module 05 · Part A — Python for Generative AI",
    blurb:
      "The scripting layer everything else runs on: API communication, SDKs, environment discipline, and batch patterns — taught in the contexts AI work actually uses them.",
    focus: [
      "requests, JSON navigation & auth patterns",
      ".env files & secrets discipline",
      "Anthropic + OpenAI SDKs in parallel",
      "Batch processing, chaining & logging",
    ],
    from: 71,
    to: 83,
  },
  {
    kind: "capstone",
    module: "python",
    number: "05",
    name: "Integration & Capstone",
    part: "Module 05 · Part B — Integration & Production",
    blurb:
      "Everything converges: Gen AI embedded inside automation workflows, integration architecture, and a complete system designed, built, deployed, and presented.",
    focus: [
      "Gen AI inside Make.com & n8n workflows",
      "Integration architecture & output contracts",
      "End-to-end use cases: triage, docs, content",
      "Design, build, deploy & present the capstone",
    ],
    from: 85,
    to: 89,
  },
];

export const scheduleDays: ScheduleDay[] = [
  // ── Module 01 · GenAI Foundations ──
  { day: 1, weekend: false, domain: "How LLMs Work — Language Models as Next-Token Predictors", aptitude: "Percentages", softSkill: "Growth Orientation", lab: "LLM Output & Next-Token Exploration" },
  { day: 2, weekend: false, domain: "Transformer Architecture — Structure, Layers, Components", aptitude: "Percentages", softSkill: "Mindset", lab: "Transformer Architecture Study" },
  { day: 3, weekend: false, domain: "Attention Mechanism — Self-attention & Multi-head Attention", aptitude: "Percentages", softSkill: "SWOT", lab: "Attention Mechanism Visualization" },
  { day: 4, weekend: false, domain: "Training Stages — Pre-training, Instruction Tuning, RLHF", aptitude: "Percentages", softSkill: "Goal Setting", lab: "Training Stages Comparative Study" },
  { day: 5, weekend: false, domain: "Scale & Emergent Capabilities — Parameters, Data, Compute", aptitude: "Percentages", softSkill: "Locus of Self-Reliance", lab: "Scale Analysis & Emergent Capability Study" },
  { day: 6, weekend: true },
  { day: 7, weekend: true },
  { day: 8, weekend: false, domain: "Tokenization — Byte-Pair Encoding, Tokens & Cost Implications", aptitude: "Number Systems, Series & Letter Series", softSkill: "Gratitude", lab: "Tokenization with tiktoken Practice" },
  { day: 9, weekend: false, domain: "Embeddings — Vector Representations & Semantic Similarity", aptitude: "Number Systems, Series & Letter Series", softSkill: "Importance of Hard Work", lab: "Embedding Generation & Similarity Exploration" },
  { day: 10, weekend: false, domain: "Vector Databases — Storing, Indexing & Querying Embeddings", aptitude: "Number Systems, Series & Letter Series", softSkill: "Being Proactive", lab: "Vector Database Setup — ChromaDB / FAISS" },
  { day: 11, weekend: false, domain: "Model Parameters — Context Window, Temperature, Top-p, Max Tokens", aptitude: "Number Systems, Series & Letter Series", softSkill: "Facing Fear", lab: "Context Window & Temperature Parameter Experiments" },
  { day: 12, weekend: false, domain: "Parameter Effects — How Each Control Changes Model Output", aptitude: "Number Systems, Series & Letter Series", softSkill: "Work Ethics & Loyalty", lab: "Advanced Parameter Tuning Practice" },
  { day: 13, weekend: false, domain: "Prompt Engineering — Zero-shot, Few-shot, Chain-of-Thought", aptitude: "Ratio & Proportions", softSkill: "Financial Literacy", lab: "Zero-shot, Few-shot & CoT Prompt Practice" },
  { day: 14, weekend: true },
  { day: 15, weekend: false, domain: "System Prompts — Role, Constraints, Output Format", aptitude: "Ratio & Proportions", softSkill: "Resilience & Learning Agility", lab: "System Prompt Design Workshop" },
  { day: 16, weekend: false, domain: "Structured Output Prompting — Reliably Extracting JSON from Models", aptitude: "Ratio & Proportions", softSkill: "Entrepreneurial Mindset", lab: "JSON Structured Output Extraction Practice" },
  { day: 17, weekend: false, domain: "Advanced Prompting — Chaining, Negative Prompting, Injection Defence", aptitude: "Ratio & Proportions", softSkill: "Creative Thinking", lab: "Advanced Prompt Chaining & Debugging Practice" },
  { day: 18, weekend: false, domain: "Prompt Versioning & Debugging — Treating Prompts as Code", aptitude: "Ratio & Proportions", softSkill: "Communication Exchange", lab: "Prompt Debugging & Version Control Practice" },
  { day: 19, weekend: false, domain: "RAG — Knowledge Cutoff, Hallucination, RAG Architecture", aptitude: "Ratio & Proportions", softSkill: "Communication Exchange", lab: "RAG Pipeline Build — PDF Ingestion & Chunking" },
  { day: 20, weekend: true },
  { day: 21, weekend: true },
  { day: 22, weekend: false, domain: "RAG Pipeline — Ingest, Chunk, Embed, Index, Retrieve, Augment", aptitude: "Simple & Compound Interest", softSkill: "Communication Exchange", lab: "Retrieval & Hybrid Search Implementation" },
  { day: 23, weekend: false, domain: "Chunking Strategies — Fixed, Sentence, Semantic, Hierarchical", aptitude: "Simple & Compound Interest", softSkill: "CE — Speaking Activities", lab: "RAG Evaluation — Precision & Recall Measurement" },
  { day: 24, weekend: false, domain: "RAG Advanced — Hybrid Retrieval, Reranking, RAG Evaluation", aptitude: "Simple & Compound Interest", softSkill: "Student PPT Presentations", lab: "Fine-Tuning vs Prompting Comparison Exercise" },
  { day: 25, weekend: false, domain: "Fine-Tuning vs Prompting — When Each Approach Is Appropriate", aptitude: "Simple & Compound Interest", softSkill: "CE — Reading Activities", lab: "Multimodal API Practice — Vision & Audio" },
  { day: 26, weekend: false, domain: "Multimodal AI — Vision, TTS, STT, Text-to-Video Generation", aptitude: "Simple & Compound Interest", softSkill: "CE — Reading Activities", lab: "Model Evaluation & Benchmark Analysis" },
  { day: 27, weekend: false, domain: "Model Selection, Evaluation & AI Ethics", aptitude: "Time & Work", softSkill: "CE — Structured Writing", lab: "Model Selection & Ethics Review Workshop" },
  { day: 28, weekend: true },
  // ── Module 02 · Automation Platforms ──
  { day: 29, weekend: false, domain: "Automation Thinking — Triggers, Actions, Conditions, Failure Design", aptitude: "Time & Work", softSkill: "CE — Structured Writing", lab: "Business Process to Automation Mapping Workshop" },
  { day: 30, weekend: false, domain: "APIs in Automation — Authentication, Pagination, Webhooks, Security", aptitude: "Time & Work", softSkill: "CE — Email Writing", lab: "REST API & Webhook Integration Practice" },
  { day: 31, weekend: false, domain: "Data Handling in Workflows — JSON, Strings, Dates, Arrays, Nulls", aptitude: "Time & Work", softSkill: "CE — Email Writing", lab: "Data Transformation & Handling Practice" },
  { day: 32, weekend: false, domain: "Make.com — Scenarios, Modules, Filters, Routers, Connections", aptitude: "Time & Work", softSkill: "CE — Email Writing", lab: "Make.com — Build Lead Capture to CRM & Slack Workflow" },
  { day: 33, weekend: false, domain: "Make.com Advanced — Aggregators, Iterators, Error Handling", aptitude: "Time & Work", softSkill: "CE — Email Writing", lab: "Make.com Advanced Workflow & Error Handling Build" },
  { day: 34, weekend: true },
  { day: 35, weekend: true },
  { day: 36, weekend: false, domain: "n8n Fundamentals — Setup, Canvas, Nodes, Expressions, Code Node", aptitude: "Time, Speed & Distance", softSkill: "CE — Describing Locations", lab: "n8n Setup & First Node-Based Workflow Build" },
  { day: 37, weekend: false, domain: "n8n Advanced — IF/Switch, Merge, Split in Batches, Sub-workflows", aptitude: "Time, Speed & Distance", softSkill: "CE — Expressing Opinions", lab: "n8n Advanced — Code Node & Sub-workflow Practice" },
  { day: 38, weekend: false, domain: "n8n Production — Deployment, Monitoring, Error Workflows", aptitude: "Time, Speed & Distance", softSkill: "Communication Skills — Barriers", lab: "n8n Production Workflow & Error Handling Build" },
  { day: 39, weekend: false, domain: "Workflow Documentation, Maintenance & Handover Practices", aptitude: "Time, Speed & Distance", softSkill: "Mindset Session", lab: "Workflow Documentation & Handover Practice" },
  { day: 40, weekend: false, domain: "Automation Architecture — End-to-End System Design & Make vs n8n", aptitude: "Time, Speed & Distance", softSkill: "Mindset Session", lab: "Automation Architecture Design & Platform Comparison" },
  { day: 41, weekend: false, domain: "Full Automation System Build Challenge — Multi-System Pipeline", aptitude: "Profit & Loss", softSkill: "Skilling Session", lab: "Full Automation System Build & Integration Challenge" },
  { day: 42, weekend: true },
  // ── Module 03 · Models & Tools ──
  { day: 43, weekend: false, domain: "Claude (Anthropic) — Haiku, Sonnet, Opus & Extended Thinking", aptitude: "Profit & Loss", softSkill: "Etiquette Session", lab: "Claude API — Document Analysis & Structured Output" },
  { day: 44, weekend: false, domain: "Claude API — Prompt Caching, Vision Inputs, Long-Context", aptitude: "Profit & Loss", softSkill: "Etiquette Session", lab: "Claude Extended Thinking & Prompt Caching Practice" },
  { day: 45, weekend: false, domain: "OpenAI — GPT-4o, Function Calling, Structured Output Mode", aptitude: "Profit & Loss", softSkill: "Communication — External Barriers", lab: "OpenAI Function Calling & Structured Output Practice" },
  { day: 46, weekend: false, domain: "Reasoning Models — o1, o3 vs Standard Generation", aptitude: "Profit & Loss", softSkill: "Communication — External Barriers", lab: "Reasoning Models — o1 vs GPT-4o Comparison" },
  { day: 47, weekend: false, domain: "Gemini — Flash, Pro, Ultra, Context Window & Native Multimodal", aptitude: "Profit & Loss", softSkill: "CE — JAM Session", lab: "Gemini API — Large Document & Video Input Practice" },
  { day: 48, weekend: true },
  { day: 49, weekend: true },
  { day: 50, weekend: false, domain: "Gemini Thinking, Grounding with Google Search", aptitude: "Problems on Ages", softSkill: "Student PPT Presentations", lab: "Gemini Thinking & Search Grounding Practice" },
  { day: 51, weekend: false, domain: "ElevenLabs — Text-to-Speech, Voice Cloning, API Integration", aptitude: "Problems on Ages", softSkill: "Student PPT Presentations", lab: "ElevenLabs TTS & Audio Generation Pipeline" },
  { day: 52, weekend: false, domain: "Model Comparison Framework — Capability, Cost, Speed, Context", aptitude: "Problems on Ages", softSkill: "CE — Self Introduction", lab: "Multi-Model Comparison & Evaluation Practice" },
  { day: 53, weekend: false, domain: "Reasoning Models Compared — o1 vs Extended Thinking vs Gemini", aptitude: "Problems on Ages", softSkill: "Group Discussion", lab: "Reasoning Model Comparison & Analysis" },
  { day: 54, weekend: false, domain: "Tool Exploration Framework — Capability, API, Pricing, Limits", aptitude: "Problems on Ages", softSkill: "Group Discussion", lab: "Independent Tool Evaluation Session" },
  { day: 55, weekend: false, domain: "Models Review — Gen AI Models Consolidation & Assessment", aptitude: "Permutations & Combinations", softSkill: "Debate", lab: "Tool Exploration Peer Presentation" },
  { day: 56, weekend: true },
  // ── Module 04 · Agentic Frameworks ──
  { day: 57, weekend: false, domain: "What Makes an Agent — Agent Loop, ReAct, Plan-and-Execute", aptitude: "Permutations & Combinations", softSkill: "Debate", lab: "Agent Loop Study & Architecture Analysis" },
  { day: 58, weekend: false, domain: "Tool Use & Function Calling — Schemas, Descriptions, Parallel Calling", aptitude: "Permutations & Combinations", softSkill: "Resume Building", lab: "Function-Calling Agent with 3 Custom Tools" },
  { day: 59, weekend: false, domain: "Memory Systems — Short-term, Long-term, Episodic, Semantic Memory", aptitude: "Permutations & Combinations", softSkill: "Resume Building", lab: "Memory Implementation — Vector Store Integration" },
  { day: 60, weekend: false, domain: "LangChain — Components, Chains, LCEL, Prompt Templates", aptitude: "Permutations & Combinations", softSkill: "LinkedIn Profile Building", lab: "LangChain Setup — Chains & LCEL Practice" },
  { day: 61, weekend: false, domain: "LangChain Agents — Executor, Memory, Callbacks, LangSmith", aptitude: "Permutations & Combinations", softSkill: "Naukri Profile Building", lab: "LangChain Agent with Tools & Conversation Memory" },
  { day: 62, weekend: true },
  { day: 63, weekend: true },
  { day: 64, weekend: false, domain: "LangGraph — Nodes, Edges, Shared State, State Schemas", aptitude: "Probability", softSkill: "Monster Profile Building", lab: "LangGraph — State Management & Graph Build" },
  { day: 65, weekend: false, domain: "LangGraph Advanced — Conditional Edges, Cycles, Human-in-Loop", aptitude: "Probability", softSkill: "Telephonic Interview Preparation", lab: "LangGraph — Conditional Edges & Complex Workflow" },
  { day: 66, weekend: false, domain: "Supervisor Pattern — Multi-Agent Orchestration with LangGraph", aptitude: "Probability", softSkill: "Telephonic Interview", lab: "Multi-Agent LangGraph with Supervisor Orchestration" },
  { day: 67, weekend: false, domain: "LlamaIndex — Data Ingestion, Index Types, Query Engines", aptitude: "Probability", softSkill: "Telephonic Interview", lab: "LlamaIndex — Document Ingestion & Index Build" },
  { day: 68, weekend: false, domain: "LlamaIndex Agents — Retrieval Combined with Tool-Use Loops", aptitude: "Probability", softSkill: "Online Interview (Zoom)", lab: "LlamaIndex Agent & RAG Pipeline Integration" },
  { day: 69, weekend: false, domain: "MCP — Model Context Protocol, Servers, Custom MCP Server Build", aptitude: "Coding-Decoding & Seating Arrangement", softSkill: "Online Interview (Zoom)", lab: "Custom MCP Server Build & Agent from Scratch" },
  { day: 70, weekend: true },
  // ── Module 05 · Part A — Python Foundation ──
  { day: 71, weekend: false, domain: "Python Fundamentals — Data Types, Strings, Lists, Dictionaries", aptitude: "Coding-Decoding & Seating Arrangement", softSkill: "Offline Interview Etiquette", lab: "Python Installation & First Scripts Practice" },
  { day: 72, weekend: false, domain: "Ordered & Unordered Collections — Lists, Tuples, Sets, Dicts", aptitude: "Coding-Decoding & Seating Arrangement", softSkill: "Offline Interview Etiquette", lab: "Data Types & Collections Practice" },
  { day: 73, weekend: false, domain: "Control Flow — if-else, Loops, Iteration, Comprehensions", aptitude: "Coding-Decoding & Seating Arrangement", softSkill: "Offline Interview Etiquette", lab: "Control Flow & Loop Practice" },
  { day: 74, weekend: false, domain: "Functions — Arguments, Returns, Scope, Error Handling", aptitude: "Coding-Decoding & Seating Arrangement", softSkill: "Offline Interview Etiquette", lab: "Functions & Error Handling Practice" },
  { day: 75, weekend: false, domain: "REST APIs — HTTP Methods, requests Library, Authentication", aptitude: "Coding-Decoding & Seating Arrangement", softSkill: "Offline Interview Etiquette", lab: "REST API Calls & Response Handling Practice" },
  { day: 76, weekend: true },
  { day: 77, weekend: true },
  { day: 78, weekend: false, domain: "JSON Parsing — Reading & Navigating Nested API Responses", aptitude: "Directions & Calendar", softSkill: "Mock Interview", lab: "JSON Parsing & API Response Practice" },
  { day: 79, weekend: false, domain: "Environment Management — .env Files, dotenv, os.environ", aptitude: "Directions & Calendar", softSkill: "Mock Interview", lab: "Environment Setup & Secrets Management Practice" },
  { day: 80, weekend: false, domain: "Anthropic SDK — Messages API, System Prompts, Response Objects", aptitude: "Directions & Calendar", softSkill: "Mock Interview", lab: "First Claude API Calls Practice" },
  { day: 81, weekend: false, domain: "OpenAI SDK — Chat Completions, Roles, Streaming, Token Counting", aptitude: "Directions & Calendar", softSkill: "Mock Interview", lab: "GPT-4o API Calls & Streaming Practice" },
  { day: 82, weekend: false, domain: "Building AI Scripts — Batch Processing, Chaining, Logging", aptitude: "Directions & Calendar", softSkill: "Mock Interview", lab: "Batch Processing & Script Building Practice" },
  { day: 83, weekend: false, domain: "Multi-turn Conversations, Cost Management & Multi-Provider Scripts", aptitude: "Blood Relations & Analogy", softSkill: "Revision — Communication", lab: "End-to-End AI Script Workshop" },
  { day: 84, weekend: true },
  // ── Module 05 · Part B — Integration & Capstone ──
  { day: 85, weekend: false, domain: "Integration Architecture — Patterns, Latency, Cost, Output Contracts", aptitude: "Blood Relations & Analogy", softSkill: "Revision — Communication", lab: "AI-Automation Integration Architecture Design" },
  { day: 86, weekend: false, domain: "Gen AI in Make.com — HTTP Module, Dynamic Prompts, Error Routes", aptitude: "Blood Relations & Analogy", softSkill: "Revision — Core Skills", lab: "Make.com + Gen AI — Email Triage Pipeline Build" },
  { day: 87, weekend: false, domain: "Gen AI in n8n — AI Agent Node, Chaining, Rate Limit Handling", aptitude: "Blood Relations & Analogy", softSkill: "Revision — Core Skills", lab: "n8n + Gen AI — Document Processing Pipeline Build" },
  { day: 88, weekend: false, domain: "End-to-End Use Cases — Email Triage, Document Pipeline, Content", aptitude: "Blood Relations & Analogy", softSkill: "Revision — Soft Skills", lab: "Capstone Project — Part 1: System Design & Build" },
  { day: 89, weekend: false, domain: "Capstone Project — Design, Build, Test & Deploy AI-Automation System", aptitude: "Blood Relations & Analogy", softSkill: "Revision — Soft Skills", lab: "Capstone Project — Part 2: Testing, Deployment & Final Presentation" },
  { day: 90, weekend: true },
];

export const totalDays = scheduleDays.length;
export const teachingDays = scheduleDays.filter((d) => !d.weekend).length;

export function blockForDay(day: number): ScheduleBlock | undefined {
  return scheduleBlocks.find((b) => day >= b.from && day <= b.to);
}

export const scheduleHours: Array<{ label: string; hours: number }> = [
  { label: "Theory", hours: programHours.theory },
  { label: "Employability", hours: programHours.employability },
  { label: "Lab", hours: programHours.lab },
  { label: "Capstone", hours: programHours.capstone },
];
