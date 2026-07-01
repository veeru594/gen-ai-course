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
    label: "arXiv cs.CL",
    url: "https://arxiv.org/list/cs.CL/recent",
    purpose: "where the field's primary papers land first",
    module: "general",
  },
];

/**
 * Visual deep-dives — articles and videos that explain the hard ideas with
 * pictures. The interactive tools live in the Visual Explainers section on the
 * Resources page; these are the read/watch companions.
 */
const visualReads: Resource[] = [
  {
    label: "The Illustrated Transformer",
    url: "https://jalammar.github.io/illustrated-transformer/",
    purpose: "Jay Alammar's picture-by-picture walk through attention",
    module: "foundations",
  },
  {
    label: "The Illustrated Stable Diffusion",
    url: "https://jalammar.github.io/illustrated-stable-diffusion/",
    purpose: "how text-to-image generation works, illustrated",
    module: "models",
  },
  {
    label: "3Blue1Brown — Neural Networks",
    url: "https://www.3blue1brown.com/topics/neural-networks",
    purpose: "the visual intuition for what a network actually learns",
    module: "foundations",
  },
  {
    label: "MLU-Explain",
    url: "https://mlu-explain.github.io/",
    purpose: "core ML concepts as short interactive visual essays",
    module: "foundations",
  },
  {
    label: "Distill.pub",
    url: "https://distill.pub/",
    purpose: "the gold standard for visual, interactive ML explanations",
    module: "general",
  },
  {
    label: "colah's blog",
    url: "https://colah.github.io/",
    purpose: "Chris Olah on the internals of neural nets, clearly drawn",
    module: "foundations",
  },
];

/** The full curated library: every module's rail, visual reads, plus general picks. */
export const allResources: Resource[] = [
  ...modules.flatMap((m) => m.resources),
  ...visualReads,
  ...generalResources,
];
