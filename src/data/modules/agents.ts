import type { Module } from "../types";

export const agents: Module = {
  id: "agents",
  number: "04",
  title: "Agentic AI Frameworks",
  hours: 35,
  tagline:
    "A system that calls a tool once is not an agent. A system that plans, acts, observes, and adapts — that is an agent.",
  intro: [
    "The term 'agent' is one of the most overused in the current AI landscape — applied to everything from a single-turn API call with a system prompt to fully autonomous multi-step systems. This module begins by establishing a precise definition and builds outward from it.",
    "A genuine AI agent perceives its environment, decides what action to take based on what it has perceived, executes that action, observes the result, and continues this loop until a goal is reached or a termination condition fires. The key properties: the ability to take actions, the ability to observe results, and the ability to use those observations to decide what to do next. A system that calls a tool once based on user input is not an agent.",
    "The frameworks covered — LangChain, LangGraph, LlamaIndex, and MCP — are the current production-grade stack. LangChain provides the building blocks. LangGraph adds stateful, graph-based orchestration. LlamaIndex provides the data layer that makes agents genuinely knowledgeable. MCP standardises how agents communicate with tools and data sources.",
  ],
  sessions: [
    {
      id: "agent-fundamentals",
      title: "Agent Fundamentals",
      paragraphs: [
        "Understanding what makes a system an agent requires understanding what makes it not one. A single LLM call is not an agent. A fixed sequence of calls where one output feeds the next input is a chain, not an agent. What separates an agent is tool access, observation, and autonomous decision-making — the system decides what to do next based on what it observed, rather than following a predetermined script.",
        "Failure modes deserve as much attention as capabilities. The most common production failure is the infinite loop: the agent acts, observes a result that does not match its goal, acts again, and repeats forever because its termination condition is never met. Maximum iteration limits, repeated-action detection, and clear termination conditions are the engineering practices that keep runaway agents from consuming unbounded resources.",
      ],
      topics: [
        {
          topic: "Call vs chain vs agent",
          meaning: "the precise distinctions and why they matter",
        },
        {
          topic: "The agent loop",
          meaning: "perceive, think, act, observe — repeat until goal reached",
        },
        {
          topic: "Autonomy",
          meaning: "making decisions rather than following a script",
        },
        {
          topic: "Failure modes",
          meaning: "stuck loops, hallucinated tool calls, wrong actions",
        },
        {
          topic: "ReAct architecture",
          meaning: "reasoning and acting interleaved in each loop iteration",
        },
        {
          topic: "Plan-and-Execute",
          meaning: "full upfront planning, then sequential execution",
        },
        {
          topic: "Reflection architecture",
          meaning: "agents that evaluate and revise their own output",
        },
        {
          topic: "Choosing an architecture",
          meaning: "matching the pattern to task and environment",
        },
        {
          topic: "When an agent is right",
          meaning: "dynamic tool selection and multi-step adaptation required",
        },
        {
          topic: "When simpler is better",
          meaning: "tasks a well-designed prompt chain handles more cheaply",
        },
      ],
    },
    {
      id: "tools-memory",
      title: "Tool Use, Function Calling, and Memory",
      paragraphs: [
        "Tool use gives agents real-world capability. Without tools an agent can only generate text; with tools it can search, query databases, read and write files, call APIs, and run code. Tool definitions deserve the same care as prompts: the description field is not documentation for the developer — it is an instruction to the model about when to use the tool. A vague description produces wrong calls and bad arguments; a precise one produces reliable tool use.",
        "Memory gives agents continuity. Short-term memory — conversation history in the context window — is automatic but bounded and lost when the context ends. Long-term memory — a vector database queried by similarity — persists indefinitely but requires explicit reads and writes. Most production agents need both.",
      ],
      topics: [
        {
          topic: "Function calling",
          meaning: "models requesting tool invocations via structured schemas",
        },
        {
          topic: "Tool definition",
          meaning: "name, description, parameter schema — descriptions matter most",
        },
        {
          topic: "Parallel tool calling",
          meaning: "multiple tools in a single model step for efficiency",
        },
        {
          topic: "Tool result handling",
          meaning: "injecting results back and deciding next steps",
        },
        {
          topic: "Building custom tools",
          meaning: "search, file reader, database query, calculator, executor",
        },
        {
          topic: "Tool reliability",
          meaning: "errors, timeouts, unexpected return formats",
        },
        {
          topic: "Short-term memory",
          meaning: "conversation history within the context window",
        },
        {
          topic: "Long-term memory",
          meaning: "persistence across sessions via external storage",
        },
        {
          topic: "Episodic memory",
          meaning: "records of past interactions, retrieved when relevant",
        },
        {
          topic: "Semantic memory",
          meaning: "factual knowledge as embeddings for similarity retrieval",
        },
        {
          topic: "Memory management",
          meaning: "what to store, what to discard, keeping memory bounded",
        },
      ],
      code: {
        language: "python",
        label: "tool_definition.py",
        code: `# The description is an instruction to the model,
# not documentation for you.
invoice_tool = {
    "name": "get_invoice_total",
    "description": (
        "Look up one invoice by its ID and return its total "
        "in INR. Use when the user references a specific "
        "invoice number. Returns null if the ID is unknown."
    ),
    "input_schema": {
        "type": "object",
        "properties": {
            "invoice_id": {
                "type": "string",
                "description": "Invoice ID, e.g. 'INV-2041'",
            }
        },
        "required": ["invoice_id"],
    },
}`,
      },
    },
    {
      id: "langchain",
      title: "LangChain",
      paragraphs: [
        "LangChain is the foundational framework for LLM-powered applications in Python: chains for composing calls, agents for autonomous tool use, memory components, and a deep ecosystem of integrations. Understanding it is prerequisite to LangGraph. LangChain Expression Language (LCEL) is the recommended composition style — piping components together declaratively, which buys readability, parallelism, and streaming.",
        "LangSmith, the observability platform, is a production discipline in its own right. Debugging an agent is harder than debugging a function because the model's reasoning is not inspectable from outside. LangSmith captures the full trace of every execution — every LLM call, every tool invocation, every intermediate output — searchable and comparable.",
      ],
      topics: [
        {
          topic: "Core components",
          meaning: "models, prompts, chains, agents, memory, tools",
        },
        {
          topic: "Prompt templates",
          meaning: "parameterised prompts via template classes",
        },
        {
          topic: "Model wrappers",
          meaning: "one interface for models from different providers",
        },
        {
          topic: "LCEL",
          meaning: "composing components with the pipe operator",
        },
        {
          topic: "Chains",
          meaning: "sequential compositions where each output feeds the next",
        },
        {
          topic: "Memory components",
          meaning: "buffer, summary, and vector-store conversation memory",
        },
        {
          topic: "Tool integration",
          meaning: "tools from functions, APIs, and the built-in library",
        },
        {
          topic: "Agents",
          meaning: "the executor, ReAct, and OpenAI-functions patterns",
        },
        {
          topic: "Callbacks and streaming",
          meaning: "observing intermediate steps, streaming to users",
        },
        {
          topic: "LangSmith",
          meaning: "tracing and evaluating chains and agents",
        },
        {
          topic: "Practical judgment",
          meaning: "when LangChain adds value, when it adds complexity",
        },
      ],
    },
    {
      id: "langgraph",
      title: "LangGraph",
      paragraphs: [
        "Real agent behaviour is not a straight line — it involves cycles, branches, backtracking, and coordination between specialised agents. Linear chains cannot express these patterns. LangGraph models agent behaviour as a directed graph: nodes are processing steps, edges define transitions, and a shared state object persists across all steps. That state-centric design makes the full context visible at every step, makes debugging tractable, and enables pause-and-resume persistence.",
        "The supervisor pattern maps directly to how complex real-world work is organised: a supervisor receives a goal, breaks it into subtasks, routes each to the specialised worker best equipped for it, and synthesises the results. Workers know nothing about each other. Human-in-the-loop interrupts address the other production question — when a human should approve what the agent is about to do. That is not a workaround for unreliable agents; it is a deliberate architecture for high-stakes workflows.",
      ],
      topics: [
        {
          topic: "Why LangGraph",
          meaning: "linear chains cannot express cycles or multi-agent work",
        },
        {
          topic: "Nodes",
          meaning: "processing units, each one step in the workflow",
        },
        {
          topic: "Edges",
          meaning: "transitions — unconditional or conditional on state",
        },
        {
          topic: "State",
          meaning: "the shared dictionary persisting across all nodes",
        },
        {
          topic: "State schemas",
          meaning: "shape and types defined with Python TypedDict",
        },
        {
          topic: "Conditional edges",
          meaning: "branching on current state or a model decision",
        },
        {
          topic: "Cycles",
          meaning: "loops that let agents retry, reflect, iterate",
        },
        {
          topic: "The END node",
          meaning: "the termination condition that stops execution",
        },
        {
          topic: "Human-in-the-loop",
          meaning: "checkpoints where review or approval is required",
        },
        {
          topic: "Supervisor pattern",
          meaning: "an orchestrator routing tasks to specialised workers",
        },
        {
          topic: "Parallel execution",
          meaning: "multiple graph branches running simultaneously",
        },
        {
          topic: "Persistence",
          meaning: "serialised state for long-running, resumable workflows",
        },
      ],
    },
    {
      id: "llamaindex-mcp",
      title: "LlamaIndex, MCP, and Building from Scratch",
      paragraphs: [
        "LlamaIndex specialises in the data layer. Where LangChain and LangGraph focus on orchestration — how agents reason, plan, coordinate — LlamaIndex focuses on how agents access and understand knowledge: ingestion, indexing, and query over large document collections and structured sources.",
        "The Model Context Protocol solves a different problem: standardisation. Every framework historically defined its own tool interface. MCP defines a common protocol for how agents describe what they need and how tool servers describe what they offer. A server built once works with any MCP-compatible agent, in any framework. Participants build a working MCP server in Python, connect it to a LangGraph agent, and watch the agent discover and use the tools with zero framework-specific glue — the practical proof of why MCP matters.",
      ],
      topics: [
        {
          topic: "Data loaders",
          meaning: "ingesting from files, databases, APIs, cloud storage",
        },
        {
          topic: "Node parsers",
          meaning: "chunking strategies per document type",
        },
        {
          topic: "Index types",
          meaning: "VectorStoreIndex, KeywordTableIndex, TreeIndex",
        },
        {
          topic: "Query engines",
          meaning: "natural-language interfaces over indexed data",
        },
        {
          topic: "Retrieval modes",
          meaning: "top-k, hybrid, and reranked strategies",
        },
        {
          topic: "Response synthesisers",
          meaning: "combining retrieved content into coherent answers",
        },
        {
          topic: "MCP architecture",
          meaning: "clients, servers, and the protocol specification",
        },
        {
          topic: "MCP server types",
          meaning: "tool servers, resource servers, prompt servers",
        },
        {
          topic: "Custom MCP servers",
          meaning: "exposing a database or API via the protocol",
        },
        {
          topic: "Capstone workshop",
          meaning: "LangGraph orchestration + LlamaIndex data + MCP tools",
        },
      ],
    },
  ],
  demos: [
    {
      id: "react-loop",
      title: "Step through an agent thinking",
      lede: "Thought, action, observation — click through a real ReAct trace one frame at a time. Then load the second trace and watch an agent loop forever until the max-iterations guard kills it. Failure modes are first-class content here.",
      afterSession: 0,
    },
  ],
  concepts: [
    {
      term: "Agent Loop",
      definition:
        "The cycle of perceive, think, act, observe, and repeat that defines agent behaviour.",
    },
    {
      term: "Function Calling",
      definition:
        "The mechanism by which a model requests the invocation of a defined tool using a structured schema.",
    },
    {
      term: "LangGraph State",
      definition:
        "A shared dictionary that persists across all nodes in a LangGraph workflow, carrying the full execution context.",
    },
    {
      term: "MCP",
      definition:
        "Model Context Protocol — an open standard for how agents communicate with tools and data sources.",
    },
    {
      term: "Supervisor Pattern",
      definition:
        "A multi-agent architecture where an orchestrator routes tasks to specialised worker agents.",
    },
    {
      term: "ReAct",
      definition:
        "Reasoning and Acting — an architecture where the model alternates between reasoning steps and action steps.",
    },
    {
      term: "LlamaIndex",
      definition:
        "A framework specialising in data ingestion, indexing, and retrieval for agent knowledge access.",
    },
    {
      term: "Human-in-the-Loop",
      definition:
        "An architectural pattern where agent workflows pause for human review or approval before proceeding.",
    },
    {
      term: "Episodic Memory",
      definition:
        "Storage of past agent interactions, retrievable to inform future behaviour.",
    },
    {
      term: "LCEL",
      definition:
        "LangChain Expression Language — declarative composition of components using the pipe operator.",
    },
    {
      term: "Conditional Edge",
      definition:
        "In LangGraph, an edge that routes to different nodes based on the current state or a model decision.",
    },
    {
      term: "LangSmith",
      definition:
        "LangChain's observability platform for tracing, debugging, and monitoring chain and agent executions.",
    },
  ],
  exercises: [
    {
      id: "g-ex1",
      level: "STARTER",
      text: "Build a ReAct agent with LangChain and three tools — web search, calculator, file writer. Give it a research task and observe how it chooses tools and order.",
    },
    {
      id: "g-ex2",
      level: "BUILD",
      text: "Reimplement the same agent as a LangGraph workflow with explicit state. Add a reflection node that evaluates the draft answer before returning it.",
    },
    {
      id: "g-ex3",
      level: "BUILD",
      text: "Ingest 20 PDFs with LlamaIndex, build a VectorStoreIndex, and connect its query engine as a tool in a LangGraph agent. Ask questions that require synthesis across documents.",
    },
    {
      id: "g-ex4",
      level: "SHIP",
      text: "Build a custom MCP server in Python exposing a SQLite database as a tool. Connect a LangChain agent and verify it queries the database while answering questions.",
    },
    {
      id: "g-ex5",
      level: "SHIP",
      text: "Implement a supervisor-worker system in LangGraph: a supervisor routes a research question to a search worker and a summarisation worker in parallel, then synthesises a final answer.",
    },
    {
      id: "g-ex6",
      level: "BUILD",
      text: "Add a human-in-the-loop checkpoint to a LangGraph workflow that pauses before any write operation, shows the proposed action, and proceeds only on explicit approval.",
    },
    {
      id: "g-ex7",
      level: "SHIP",
      text: "Build a LangGraph agent with both short-term memory (conversation buffer) and long-term memory (vector store). Verify across separate runs that it recalls facts from previous sessions.",
    },
  ],
  resources: [
    {
      label: "LangChain Docs",
      url: "https://python.langchain.com/docs/introduction/",
      purpose: "chains, agents, LCEL, memory — the foundational layer",
      module: "agents",
    },
    {
      label: "LangGraph Docs",
      url: "https://langchain-ai.github.io/langgraph/",
      purpose: "nodes, edges, state, interrupts — graph orchestration",
      module: "agents",
    },
    {
      label: "LlamaIndex Docs",
      url: "https://docs.llamaindex.ai/",
      purpose: "loaders, indexes, query engines — the agent data layer",
      module: "agents",
    },
    {
      label: "Model Context Protocol",
      url: "https://modelcontextprotocol.io/",
      purpose: "the spec, plus build-a-server tutorials in Python",
      module: "agents",
    },
    {
      label: "ReAct: Synergizing Reasoning and Acting",
      url: "https://arxiv.org/abs/2210.03629",
      purpose: "the paper behind the thought/action/observation loop",
      module: "agents",
    },
    {
      label: "Anthropic — Building Effective Agents",
      url: "https://www.anthropic.com/research/building-effective-agents",
      purpose: "when to use agents and when a workflow is enough",
      module: "agents",
    },
    {
      label: "LangSmith Docs",
      url: "https://docs.smith.langchain.com/",
      purpose: "trace every LLM call and tool invocation your agent makes",
      module: "agents",
    },
  ],
};
