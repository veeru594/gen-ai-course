import type { Module } from "../types";

export const automation: Module = {
  id: "automation",
  number: "02",
  title: "Automation Platforms & Workflow Design",
  hours: 45,
  tagline:
    "Automation is a discipline with its own principles and failure modes — entirely independent of AI. Learn it on its own terms first.",
  intro: [
    "Automation is a discipline with its own principles, vocabulary, and failure modes that are entirely independent of AI. A workflow in Make or n8n that moves data between a CRM and a spreadsheet involves no AI at all. Conversely, calling Claude to summarise a document is Generative AI work with no automation involved. The intersection — Generative AI embedded inside automation pipelines — is powerful, but it can only be understood by someone who understands each discipline on its own terms first.",
    "The module begins with automation thinking — the conceptual framework for approaching automation problems — before any platform is introduced. Participants who understand the principles can work in any platform. Participants who only know how to click through one platform's interface are helpless when the platform changes or when they hit a problem the interface does not expose a solution for.",
    "Two production-grade platforms are covered in depth. Make.com is the right tool when visual orchestration and breadth of native integrations matter. n8n is the right tool when complexity, control, and self-hosting matter — it handles advanced branching, custom logic, and data volumes that Make cannot.",
  ],
  sessions: [
    {
      id: "automation-thinking",
      title: "Automation Thinking",
      paragraphs: [
        "Most people approaching automation for the first time try to figure out the tool before they have understood the problem. They open Make or n8n, look for a trigger that resembles their starting point, and start connecting modules without a clear model of what they are building. The result works for the happy path and breaks on the first edge case — because the edge cases were never considered during design.",
        "Particular emphasis goes to designing for failure. In production, workflows run unattended. When an API is down, a record has an unexpected format, or a required field is missing — nobody is watching. A workflow designed for the happy path fails silently or corrupts data. A workflow designed for failure logs the problem, alerts the right person, and either retries or stops cleanly.",
      ],
      topics: [
        {
          topic: "What automation is",
          meaning: "systematic, unattended execution of a defined process",
        },
        {
          topic: "What it is not",
          meaning:
            "it does not handle ambiguity or judgement calls without being told how",
        },
        {
          topic: "Triggers",
          meaning:
            "the initiating event — schedule, webhook, new record, form submission",
        },
        {
          topic: "Actions",
          meaning: "create, read, update, delete, send, transform",
        },
        {
          topic: "Conditions",
          meaning: "branching logic that routes execution based on data values",
        },
        {
          topic: "Loops",
          meaning: "repeating an action over each item in a collection",
        },
        {
          topic: "Data mapping",
          meaning: "a field from one system written to its counterpart in another",
        },
        {
          topic: "Identifying candidates",
          meaning: "repetitive, rule-based, high-volume, low-variation tasks",
        },
        {
          topic: "Designing for failure",
          meaning: "what the workflow does at each step when something goes wrong",
        },
        {
          topic: "Idempotency",
          meaning: "safe to re-run without duplicating effects",
        },
        {
          topic: "Retry logic",
          meaning: "attempting failed steps again with appropriate delays",
        },
        {
          topic: "Dead letter handling",
          meaning: "what happens to records that have failed all retries",
        },
        {
          topic: "Monitoring",
          meaning: "knowing when a production workflow is failing or degraded",
        },
        {
          topic: "The hidden cost",
          meaning: "maintenance burden when connected systems change",
        },
      ],
    },
    {
      id: "apis-webhooks-data",
      title: "APIs, Webhooks, and Data Handling",
      paragraphs: [
        "Automation platforms connect systems, and the mechanism is almost always an API or a webhook. Native connectors are convenient wrappers around API calls — they abstract the HTTP details but cannot cover every API in existence. A practitioner who understands the underlying communication can connect to any system, not just the ones with connectors.",
        "Pagination is a particularly common source of silent data loss: an API that returns results in pages will return the first page and silently require more calls for the rest. A workflow that does not paginate processes only page one — no error, no warning, data simply lost. Webhook security gets the same first-class treatment: every webhook integration built in this program validates the provider's signature, without exception.",
      ],
      topics: [
        {
          topic: "REST APIs",
          meaning: "resources, endpoints, HTTP methods, request-response cycle",
        },
        {
          topic: "Authentication",
          meaning: "API keys in headers, OAuth 2.0 flows, credential management",
        },
        {
          topic: "Request construction",
          meaning: "base URL, path params, query strings, headers, body",
        },
        {
          topic: "Response handling",
          meaning: "status codes, body parsing, error detection",
        },
        {
          topic: "Pagination",
          meaning: "iterating through pages of API results automatically",
        },
        {
          topic: "Webhooks",
          meaning: "external systems pushing event data to your endpoint URL",
        },
        {
          topic: "Polling vs webhooks",
          meaning: "comparing the approaches and choosing appropriately",
        },
        {
          topic: "Webhook security",
          meaning: "signature validation to prevent spoofed requests",
        },
        {
          topic: "JSON navigation",
          meaning: "nested fields, arrays, and managing missing keys",
        },
        {
          topic: "Date / time handling",
          meaning: "parsing, formatting, timezones, date arithmetic",
        },
        {
          topic: "Array operations",
          meaning: "filtering, mapping, aggregating, iterating collections",
        },
        {
          topic: "Data validation",
          meaning: "required fields exist and have expected types",
        },
        {
          topic: "Null and missing data",
          meaning: "defaults, fallbacks, branching on absent values",
        },
      ],
      code: {
        language: "python",
        label: "verify_webhook.py",
        code: `import hashlib
import hmac
import os

def verify_signature(body: bytes, signature: str) -> bool:
    """Reject any webhook whose signature does not match.
    Non-optional on every endpoint we build."""
    secret = os.environ["WEBHOOK_SECRET"].encode()
    expected = hmac.new(secret, body, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, signature)`,
      },
    },
    {
      id: "make",
      title: "Make.com",
      paragraphs: [
        "Make is the platform for building automation workflows efficiently and visually. Its strength is the breadth of its native integrations — over 1,500 apps — and the clarity of its visual canvas. The visual nature has a pedagogical benefit too: it makes data flow visible. You see exactly what enters each module, what it looks like after transformation, and what leaves for the next step.",
        "The iterator and aggregator pair is where Make's real power for data processing appears. An iterator splits an array into individual bundles so each item is processed independently; an aggregator collects the results back into one array. Together they enable per-item processing within a single scenario — essential for any workflow that processes collections of records.",
      ],
      topics: [
        {
          topic: "Scenarios",
          meaning: "the fundamental unit of work containing a complete workflow",
        },
        {
          topic: "Modules",
          meaning: "individual steps — app connections or data operations",
        },
        {
          topic: "Connections",
          meaning: "authenticating to external services, managing credentials",
        },
        {
          topic: "Triggers",
          meaning: "webhook (instant), schedule, and watch — and their differences",
        },
        {
          topic: "Filters",
          meaning: "conditional logic between modules that gates execution",
        },
        {
          topic: "Routers",
          meaning: "splitting execution into parallel or conditional branches",
        },
        {
          topic: "Aggregators",
          meaning: "collecting multiple bundles into a single structured output",
        },
        {
          topic: "Iterators",
          meaning: "splitting an array into bundles for per-item processing",
        },
        {
          topic: "Error handling",
          meaning: "error routes, fallback modules, incomplete run management",
        },
        {
          topic: "Scenario monitoring",
          meaning: "execution history, bundle inspection, debugging failed runs",
        },
        {
          topic: "Scheduling",
          meaning: "run frequency and Make's execution model",
        },
        {
          topic: "Real use cases",
          meaning: "CRM sync, email workflows, report generation, lead routing",
        },
      ],
    },
    {
      id: "n8n",
      title: "n8n",
      paragraphs: [
        "n8n is the platform for complex, developer-grade automation. It is open source — so it can be self-hosted, which matters for organisations whose data cannot transit a third-party cloud. Make abstracts complexity; n8n exposes it. That means a steeper learning curve but fewer ceiling effects: when you need something complex, n8n usually has a way, even if it requires writing some JavaScript.",
        "Error workflows are one of n8n's most powerful and least-used features. Rather than handling errors inline, a dedicated error workflow triggers whenever any workflow execution fails. Business logic lives in the main workflow, error handling in its own pipeline — a separation of concerns that produces systems easier to maintain, monitor, and trust in production.",
      ],
      topics: [
        {
          topic: "Why n8n",
          meaning: "open source, self-hosted, full data control, no per-op pricing",
        },
        {
          topic: "Running n8n",
          meaning: "npm install, Docker setup, or cloud-hosted",
        },
        {
          topic: "The canvas",
          meaning: "workflow editor, node panel, execution log, credentials",
        },
        {
          topic: "n8n expressions",
          meaning: "referencing previous node output and computing values",
        },
        {
          topic: "The Code node",
          meaning: "a full JavaScript runtime for custom transformation logic",
        },
        {
          topic: "HTTP Request node",
          meaning: "calling any external API with full request control",
        },
        {
          topic: "IF and Switch nodes",
          meaning: "binary and multi-path conditional routing",
        },
        {
          topic: "Merge nodes",
          meaning: "combining data streams from multiple branches",
        },
        {
          topic: "Split in Batches",
          meaning: "processing large datasets in chunks to manage memory",
        },
        {
          topic: "Sub-workflows",
          meaning: "reusable components callable from parent workflows",
        },
        {
          topic: "Error workflows",
          meaning: "dedicated pipelines triggered when any execution fails",
        },
        {
          topic: "Deploying n8n",
          meaning: "self-hosting, persistence, resources, backups",
        },
      ],
    },
  ],
  demo: {
    id: "workflow",
    title: "Watch a workflow fail well",
    lede: "Run the pipeline and watch data move. Then break the validate step and watch the same packet route to a dead-letter node instead of corrupting downstream systems. That second run is the whole discipline.",
    afterSession: 0,
  },
  concepts: [
    {
      term: "Trigger",
      definition:
        "The event that initiates a workflow — a scheduled time, an incoming webhook, a new record, or a form submission.",
    },
    {
      term: "Webhook",
      definition:
        "An HTTP endpoint that receives data pushed by an external system when an event occurs.",
    },
    {
      term: "Aggregator",
      definition:
        "A Make module that collects multiple output bundles into a single structured result.",
    },
    {
      term: "Iterator",
      definition:
        "A Make module that splits a single array into individual bundles for per-item processing.",
    },
    {
      term: "Idempotency",
      definition:
        "The property of a workflow that can be safely re-run without duplicating effects or corrupting data.",
    },
    {
      term: "Sub-workflow",
      definition:
        "A reusable workflow component in n8n that can be called from other workflows.",
    },
    {
      term: "Dead Letter",
      definition:
        "A record that has failed all retry attempts and needs separate handling — logged, flagged, or manually reviewed.",
    },
    {
      term: "Error Workflow",
      definition:
        "A dedicated n8n workflow triggered when any other workflow execution fails, separating error handling from business logic.",
    },
    {
      term: "Pagination",
      definition:
        "APIs returning large datasets across multiple pages, requiring sequential calls to retrieve all records.",
    },
    {
      term: "Webhook Signature",
      definition:
        "A cryptographic hash in webhook request headers that verifies the request came from the genuine sender.",
    },
    {
      term: "Polling",
      definition:
        "Repeatedly calling an API on a schedule to check for new data, as opposed to receiving a webhook when data changes.",
    },
  ],
  exercises: [
    {
      id: "a-ex1",
      level: "STARTER",
      text: "Map out a lead-capture workflow on paper first — confirmation email, CRM entry, Slack notification, spreadsheet log. Triggers, actions, conditions, failure cases, before touching any tool.",
    },
    {
      id: "a-ex2",
      level: "STARTER",
      text: "Build that workflow in Make.com. Add a filter that routes leads differently based on the company-size field in the form.",
    },
    {
      id: "a-ex3",
      level: "BUILD",
      text: "Rebuild the same workflow in n8n using the HTTP Request node to call the CRM API directly. Add a Code node that normalises phone number formats before sending.",
    },
    {
      id: "a-ex4",
      level: "SHIP",
      text: "Build an n8n workflow that reads 100 JSON records, processes each through an HTTP API call, handles rate-limit errors with wait-and-retry in a Code node, and writes successes to CSV.",
    },
    {
      id: "a-ex5",
      level: "BUILD",
      text: "Create a Make scenario that receives a form webhook, routes on field values, and sends different Slack messages to different channels per branch.",
    },
    {
      id: "a-ex6",
      level: "SHIP",
      text: "Build one n8n sub-workflow that owns all error notification logic — receives error details, formats a structured Slack alert, logs to Google Sheets. Connect it as the error workflow for three other workflows.",
    },
    {
      id: "a-ex7",
      level: "SHIP",
      text: "Design and implement a polling workflow: check an external API every 15 minutes, compare against a tracking sheet, process only unseen records, update the sheet.",
    },
  ],
  resources: [
    {
      label: "n8n Docs",
      url: "https://docs.n8n.io/",
      purpose: "nodes, expressions, Code node, error workflows — all of it",
      module: "automation",
    },
    {
      label: "Make Academy",
      url: "https://academy.make.com/",
      purpose: "free structured courses from beginner to advanced scenarios",
    module: "automation",
    },
    {
      label: "Make Help Center",
      url: "https://www.make.com/en/help",
      purpose: "module reference: routers, iterators, aggregators, error routes",
      module: "automation",
    },
    {
      label: "webhook.site",
      url: "https://webhook.site/",
      purpose: "get a disposable URL, inspect incoming webhook payloads live",
      module: "automation",
    },
    {
      label: "Hoppscotch",
      url: "https://hoppscotch.io/",
      purpose: "fire test API requests from the browser, no install",
      module: "automation",
    },
    {
      label: "n8n Code Node Docs",
      url: "https://docs.n8n.io/code/code-node/",
      purpose: "the JavaScript escape hatch for transformations expressions can't do",
      module: "automation",
    },
    {
      label: "MDN — An Overview of HTTP",
      url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview",
      purpose: "the request-response cycle every connector abstracts away",
      module: "automation",
    },
  ],
};
