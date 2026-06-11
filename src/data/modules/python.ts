import type { Module } from "../types";

export const python: Module = {
  id: "python",
  number: "05",
  title: "Python for Generative AI — Integration and Implementation",
  hours: 45,
  tagline:
    "Part A builds the scripting depth AI work actually uses. Part B embeds Generative AI inside the automation workflows from earlier modules — reliably.",
  intro: [
    "Python is the dominant language of the AI engineering ecosystem. Every major model provides a Python SDK. Every agentic framework is written in Python. Every automation platform with a developer API supports Python integrations.",
    "This module is structured in two parts. Part A covers the Python scripting foundation — the specific subset of Python that appears in Generative AI work, from API communication and SDK usage through batch processing and chaining. Part B is the integration capstone: embedding Generative AI capabilities inside the automation workflows built in earlier modules, with a focus on reliability, cost management, and production readiness.",
    "By this point participants have four modules of hands-on exposure behind them, so much of the foundation has been absorbed implicitly. Part A focuses on the patterns that matter for AI engineering rather than language fundamentals; Part B brings every preceding module together in complete, documented, deployed AI-automation systems.",
  ],
  sessions: [
    {
      id: "core-python",
      title: "Core Python Fundamentals for AI Work",
      paragraphs: [
        "The starting point is not Hello World. It is the specific subset of Python that appears constantly in AI integration code: strings and how to manipulate them (because every prompt is a string), dictionaries and how to navigate them (because every API response is a dictionary), and functions (because reusable prompt templates are functions).",
        "Error handling receives particular attention. AI API calls fail. Networks drop. Rate limits hit. A script that crashes on the first error is not a useful script. Participants write code that handles failures gracefully — logging what went wrong, retrying where appropriate, failing cleanly when retrying is not possible.",
      ],
      topics: [
        {
          topic: "Strings, ints, booleans",
          meaning: "data types in the context of AI inputs and outputs",
        },
        {
          topic: "Lists and dictionaries",
          meaning: "the structures that carry AI data through a pipeline",
        },
        {
          topic: "Control flow",
          meaning: "if-else and loops as they appear in AI scripts",
        },
        {
          topic: "Functions",
          meaning: "reusable prompt templates and API call wrappers",
        },
        {
          topic: "File I/O",
          meaning: "text, JSON, and CSV as pipeline data sources",
        },
        {
          topic: "try-except",
          meaning: "managing failures in API-dependent code",
        },
        {
          topic: "Debugging",
          meaning: "reading tracebacks, finding failure points",
        },
        {
          topic: "Code organisation",
          meaning: "structuring scripts to be readable and modifiable",
        },
      ],
    },
    {
      id: "apis-json",
      title: "Working with APIs and JSON",
      paragraphs: [
        "Every AI model in this curriculum is accessed via a REST API, and every response comes back as JSON. The requests library is the primary tool — the one participants will meet in virtually every AI integration codebase. The focus is the patterns AI usage actually needs: POST with JSON bodies, authentication via headers, pagination, and retry logic for rate-limited endpoints.",
        "Rate limiting is addressed directly because every AI API imposes limits, and a script that does not handle them will fail in production. Detect the 429, wait for the Retry-After duration, retry — built as a reusable utility that participants carry into every subsequent piece of work. Exponential backoff is the production-standard refinement.",
      ],
      topics: [
        {
          topic: "REST fundamentals",
          meaning: "resources, methods, endpoints, request-response",
        },
        {
          topic: "The requests library",
          meaning: "GET and POST in practice",
        },
        {
          topic: "Request structure",
          meaning: "base URL, path params, query strings, headers, body",
        },
        {
          topic: "Authentication patterns",
          meaning: "API keys in headers, bearer tokens, passing them safely",
        },
        {
          topic: "JSON structure",
          meaning: "objects, arrays, nesting — navigating multi-level responses",
        },
        {
          topic: "Status codes",
          meaning: "what 200, 400, 401, 429, 500 mean and how to handle each",
        },
        {
          topic: "Rate limiting",
          meaning: "detecting 429s and implementing exponential backoff",
        },
        {
          topic: "Pagination",
          meaning: "APIs returning large datasets across multiple calls",
        },
      ],
    },
    {
      id: "env-sdks",
      title: "Environment Management and AI SDKs",
      paragraphs: [
        "Credential management is not a security lecture — it is a practical skill affecting everyone who writes code that calls an API. Keys committed to version control are a consistently common and costly mistake. Every code example in this program loads credentials from the environment, never hardcoded, because the examples set the standard for the code participants write afterward.",
        "The Anthropic and OpenAI SDKs are covered in parallel because their patterns rhyme: create a client, pass messages, receive a response object. Reading the full response object — finish reason, usage statistics, metadata — is the habit that separates careful practitioners from careless ones.",
      ],
      topics: [
        {
          topic: "Why not hardcode keys",
          meaning: "credentials leak through version control",
        },
        {
          topic: ".env files",
          meaning: "credentials outside of code in key-value format",
        },
        {
          topic: "python-dotenv",
          meaning: "the standard loading pattern for AI projects",
        },
        {
          topic: "os.environ",
          meaning: "safe credential retrieval at runtime",
        },
        {
          topic: "Multiple environments",
          meaning: "different keys for local, staging, production",
        },
        {
          topic: "Anthropic SDK",
          meaning: "client, messages API, system prompts, response objects",
        },
        {
          topic: "OpenAI SDK",
          meaning: "client, chat completions, roles and message structure",
        },
        {
          topic: "Request parameters",
          meaning: "model, temperature, max tokens, stop sequences",
        },
        {
          topic: "Response parsing",
          meaning: "text, finish reason, usage data",
        },
        {
          topic: "Streaming",
          meaning: "processing tokens as they arrive",
        },
        {
          topic: "SDK errors",
          meaning: "AuthenticationError, RateLimitError, APIConnectionError",
        },
      ],
      code: {
        language: "python",
        label: "first_call.py",
        code: `import os

from anthropic import Anthropic
from dotenv import load_dotenv

load_dotenv()  # reads .env; key never appears in code

client = Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    system="You are a concise technical writer.",
    messages=[
        {"role": "user", "content": "Explain webhooks in 2 sentences."}
    ],
)

print(response.content[0].text)
# Read the whole object, not just the text:
print(response.stop_reason, response.usage.input_tokens,
      response.usage.output_tokens)`,
      },
    },
    {
      id: "ai-scripts",
      title: "Building AI Scripts",
      paragraphs: [
        "This session moves from individual calls to complete scripts that do something useful — batch processors, conversation managers, content pipelines, data extractors. Participants write these patterns themselves rather than running example code.",
        "The final pattern — chaining calls — is where scripted AI work gets its real power. A single call is limited. A sequence — extract structure, then enrich, then format — produces outputs no single prompt reliably achieves. Designing chains, managing state between calls, and handling failure at any point in the sequence is a foundational production skill.",
      ],
      topics: [
        {
          topic: "Single-turn scripts",
          meaning: "one prompt, one response, structured output to file",
        },
        {
          topic: "Multi-turn scripts",
          meaning: "maintaining message history across calls",
        },
        {
          topic: "Batch processing",
          meaning: "reading inputs from CSV/JSON, processing each",
        },
        {
          topic: "Chaining calls",
          meaning: "one model's output becomes the next one's input",
        },
        {
          topic: "Parameterised prompts",
          meaning: "templates with dynamic variable substitution",
        },
        {
          topic: "Writing results",
          meaning: "JSON files, CSV exports, plain-text reports",
        },
        {
          topic: "Logging",
          meaning: "prompts, responses, timestamps, token usage — auditable",
        },
        {
          topic: "Cost tracking",
          meaning: "accumulating usage and calculating cost across a batch",
        },
      ],
    },
    {
      id: "integration-architecture",
      title: "Integration Architecture",
      paragraphs: [
        "The integration layer is where Generative AI lives inside automation workflows, and the wrong decision at this level produces workflows that are expensive, unreliable, or unmaintainable. Cost is concrete: a workflow that runs a thousand times a day makes a thousand AI calls a day. At GPT-4o pricing that can be thousands of dollars a month; at Haiku or Flash pricing, a fraction. The most appropriate model — not the most capable — is an architectural decision.",
        "Output contracts are the integration detail most teams skip and then regret. Downstream steps depend on what the AI returns. If the model wraps JSON in a markdown fence, the parser fails. If field names drift between prompt versions, references break silently. Define exactly what the AI must return — format, field names, types — and enforce it with a validation step before anything flows downstream.",
      ],
      topics: [
        {
          topic: "Call placement",
          meaning: "trigger, mid-process, or output-generation step",
        },
        {
          topic: "Sync vs async integration",
          meaning: "wait for the response, or dispatch and collect later",
        },
        {
          topic: "Latency management",
          meaning: "AI calls take 1–30 seconds, not milliseconds — design for it",
        },
        {
          topic: "Cost management",
          meaning: "per-call pricing makes model selection an economic decision",
        },
        {
          topic: "Output contracts",
          meaning: "exactly what the AI returns, so downstream can rely on it",
        },
        {
          topic: "Prompt stability",
          meaning: "prompt changes are deployments — versioned and tested",
        },
        {
          topic: "AI-specific failures",
          meaning: "timeout, context overflow, unexpected format, rate limit",
        },
        {
          topic: "Fallback strategies",
          meaning: "what the workflow does when the AI fails after retries",
        },
        {
          topic: "Caching",
          meaning: "avoiding redundant calls for identical inputs",
        },
        {
          topic: "Model-per-step selection",
          meaning: "capability vs cost vs latency, in context",
        },
      ],
    },
    {
      id: "genai-in-platforms",
      title: "Generative AI in Make.com and n8n",
      paragraphs: [
        "Make's HTTP module is the primary mechanism for calling AI APIs from a workflow — Claude, GPT-4o, Gemini, ElevenLabs all use the same module with different configurations. The end-to-end build: an email triage workflow that classifies incoming mail with Claude, routes to teams, and drafts replies.",
        "In n8n, the AI Agent node plus the Code node forms a particularly powerful pattern for document pipelines. The AI Agent node handles the intelligence — understanding structure, extracting fields, classifying. The Code node handles the engineering — validating extractions, transforming to the destination format, flagging records outside expected ranges for human review. AI does what AI does well; the data engineering stays in code where it is testable. One caution: n8n does not throttle automatically — a loop over 500 records fires 500 requests as fast as the network allows.",
      ],
      topics: [
        {
          topic: "HTTP module AI calls",
          meaning: "method, URL, headers, body configuration in Make",
        },
        {
          topic: "Dynamic prompts",
          meaning: "injecting workflow data into prompt construction",
        },
        {
          topic: "Parsing AI responses",
          meaning: "extracting text, metadata, structured fields in Make",
        },
        {
          topic: "Conditional routing on AI output",
          meaning: "different branches for different model responses",
        },
        {
          topic: "Error routes for AI calls",
          meaning: "fallbacks, Slack alerts, failure logging",
        },
        {
          topic: "AI Agent node",
          meaning: "n8n's built-in LangChain integration for agents",
        },
        {
          topic: "Code node processing",
          meaning: "parsing, validating, normalising model outputs",
        },
        {
          topic: "Chaining AI calls",
          meaning: "one model's output as the next step's input",
        },
        {
          topic: "Rate limit handling",
          meaning: "wait steps, batching, queue-based patterns",
        },
        {
          topic: "End-to-end builds",
          meaning: "email triage in Make; PDF extraction pipeline in n8n",
        },
      ],
    },
    {
      id: "production-readiness",
      title: "System Design, Documentation, and Production Readiness",
      paragraphs: [
        "The final section hands participants a requirement they have not seen before. They design the architecture, choose the tools, implement, handle the failure cases, document, and deploy. AI-automation system design differs from conventional software in one important respect: the AI components are non-deterministic. Identical inputs can produce different outputs, so the correctness guarantees of conventional software do not apply. Validation steps, human review checkpoints, and quality monitoring are the compensating controls.",
        "Documentation gains components conventional software does not need: the prompts at each AI step and the reasoning behind their design, the expected output format and the validation that enforces it, the model version in use and the date of last evaluation.",
      ],
      topics: [
        {
          topic: "System design process",
          meaning: "requirement to architecture diagram to implementation plan",
        },
        {
          topic: "Tool selection",
          meaning: "Make vs n8n, which model per step, when agents are needed",
        },
        {
          topic: "Documenting AI systems",
          meaning: "architecture, data flows, AI integration points, failure handling",
        },
        {
          topic: "Production monitoring",
          meaning: "metrics, alert thresholds, detecting degradation",
        },
        {
          topic: "Prompt maintenance",
          meaning: "detecting and responding to prompt drift",
        },
        {
          topic: "Upstream changes",
          meaning: "what breaks when connected APIs change format",
        },
        {
          topic: "Handover",
          meaning: "what a handover document contains and why it matters",
        },
        {
          topic: "Final project",
          meaning: "a complete AI-automation system from a provided spec",
        },
      ],
    },
  ],
  demo: {
    id: "contract",
    title: "Validate the model's output before it hurts you",
    lede: "A model reply rarely arrives as clean JSON. Run the validation pipeline — strip fences, parse, check schema — and load the broken variants. Output contracts are the thing that keeps automations alive.",
    afterSession: 4,
  },
  concepts: [
    {
      term: "Token",
      definition:
        "The basic unit of text a language model processes — roughly three-quarters of a word in English.",
    },
    {
      term: "SDK",
      definition:
        "Software Development Kit — a library that wraps an API in a convenient interface for a specific language.",
    },
    {
      term: "Environment Variable",
      definition:
        "A value stored in the operating environment rather than in code, used to pass configuration and credentials safely.",
    },
    {
      term: "Streaming",
      definition:
        "Receiving model output token by token as it is generated, rather than waiting for the complete response.",
    },
    {
      term: "Exponential Backoff",
      definition:
        "A retry strategy that doubles the wait between attempts, preventing overwhelming a rate-limited API.",
    },
    {
      term: "Finish Reason",
      definition:
        "A response field indicating whether generation stopped naturally or was cut short by a token limit.",
    },
    {
      term: "Batch Processing",
      definition:
        "Running the same operation across a collection of inputs, typically file-in, file-out.",
    },
    {
      term: "Output Contract",
      definition:
        "An explicit specification of what an AI call must return — format, field names, types — that downstream steps depend on.",
    },
    {
      term: "Prompt Stability",
      definition:
        "Treating prompt changes as code deployments — version-controlled, tested, rolled out deliberately.",
    },
    {
      term: "Prompt Drift",
      definition:
        "Gradual degradation of prompt performance as underlying model behaviour changes with updates.",
    },
  ],
  exercises: [
    {
      id: "p-ex1",
      level: "STARTER",
      text: "Write a script that reads product names from CSV, calls Claude for a one-sentence description of each, and writes the results to a new CSV with a description column.",
    },
    {
      id: "p-ex2",
      level: "BUILD",
      text: "Extend that script with retry logic — on a rate-limit error, wait 30 seconds and retry up to 3 times before logging the failure and moving on.",
    },
    {
      id: "p-ex3",
      level: "STARTER",
      text: "Build a multi-turn conversation script that maintains context across 5 exchanges and saves the full history as JSON at the end.",
    },
    {
      id: "p-ex4",
      level: "BUILD",
      text: "Write a parameterised prompt template function — customer name, product category, issue description — producing a structured support response via the OpenAI SDK.",
    },
    {
      id: "p-ex5",
      level: "BUILD",
      text: "Call the same prompt across Claude, GPT-4o, and Gemini; log response, token usage, and latency for each; write a comparison CSV.",
    },
    {
      id: "p-ex6",
      level: "SHIP",
      text: "Implement a streaming handler that prints tokens as they arrive and accumulates the final string — correctly, for both the Anthropic and OpenAI SDKs.",
    },
    {
      id: "p-ex7",
      level: "SHIP",
      text: "Build an output-contract validation step in n8n: after each AI call, a Code node checks valid JSON, required fields, and types — routing to an error branch on failure.",
    },
    {
      id: "p-ex8",
      level: "SHIP",
      text: "Implement a cost-aware workflow: a cheap fast model classifies first; only low-confidence results escalate to an expensive model. Measure cost and accuracy across 50 inputs.",
    },
  ],
  resources: [
    {
      label: "Requests Docs",
      url: "https://requests.readthedocs.io/",
      purpose: "the HTTP library in every AI integration codebase",
      module: "python",
    },
    {
      label: "python-dotenv",
      url: "https://github.com/theskumar/python-dotenv",
      purpose: "load credentials from .env — never hardcode keys",
      module: "python",
    },
    {
      label: "Anthropic Python SDK",
      url: "https://github.com/anthropics/anthropic-sdk-python",
      purpose: "client, messages, streaming — with runnable examples",
      module: "python",
    },
    {
      label: "OpenAI Python SDK",
      url: "https://github.com/openai/openai-python",
      purpose: "chat completions, structured outputs, error types",
      module: "python",
    },
    {
      label: "Claude API — Getting Started",
      url: "https://docs.claude.com/en/api/overview",
      purpose: "auth, request shape, and your first messages call",
      module: "python",
    },
    {
      label: "Python json Module",
      url: "https://docs.python.org/3/library/json.html",
      purpose: "loads, dumps, and the errors malformed output raises",
      module: "python",
    },
    {
      label: "Python csv Module",
      url: "https://docs.python.org/3/library/csv.html",
      purpose: "DictReader/DictWriter for batch pipeline I/O",
      module: "python",
    },
  ],
};
