import type { Resource } from "./types";
import { modules } from "./modules";

const generalResources: Resource[] = [
  {
    label: "Anthropic Academy",
    url: "https://www.anthropic.com/learn",
    purpose: "free structured courses on building with Claude",
    module: "general",
  },
  {
    label: "OpenAI Cookbook",
    url: "https://cookbook.openai.com/",
    purpose: "working code for every common API pattern",
    module: "general",
  },
  {
    label: "Google AI Studio",
    url: "https://aistudio.google.com/",
    purpose: "prototype Gemini prompts in the browser before writing code",
    module: "general",
  },
  {
    label: "arXiv cs.CL",
    url: "https://arxiv.org/list/cs.CL/recent",
    purpose: "where the field's primary papers land first",
    module: "general",
  },
];

/** The full curated library: every module's rail plus general picks. */
export const allResources: Resource[] = [
  ...modules.flatMap((m) => m.resources),
  ...generalResources,
];
