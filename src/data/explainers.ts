import type { ModuleId } from "./types";

/**
 * Visual explainers — interactive third-party tools we embed inside our own
 * frame on the Resources page. The point is "see, don't read": each one runs
 * live, wrapped in our guide copy so it teaches a specific curriculum concept
 * rather than being a bare outbound link.
 *
 * `embed` is set from a real framing check (X-Frame-Options / CSP). All seven
 * below were verified frame-able; the fallback path exists for any future entry
 * that refuses embedding.
 */

export interface Explainer {
  id: string;
  title: string;
  /** who made it — credited in our chrome */
  source: string;
  url: string;
  /** drives the hue + tag, reusing the module color system */
  module: ModuleId;
  /** the concept it teaches, e.g. "Attention & transformers" */
  concept: string;
  /** our one-line "why this is worth your time" */
  blurb: string;
  /** false → render the launch fallback instead of an iframe */
  embed: boolean;
  /** the ownership layer: what we tell the learner to look at and try */
  guide: {
    look: string[];
    try: string[];
  };
}

export const explainers: Explainer[] = [
  {
    id: "transformer-explainer",
    title: "Transformer Explainer",
    source: "Polo Club, Georgia Tech",
    url: "https://poloclub.github.io/transformer-explainer/",
    module: "foundations",
    concept: "Attention & next-token prediction",
    blurb:
      "A live GPT-2 running in your browser — watch a real transformer turn your words into the next token, layer by layer.",
    embed: true,
    guide: {
      look: [
        "Type a sentence and watch the probabilities for the next token appear on the right — this is the whole game of an LLM.",
        "Follow one token down through the layers: embedding → attention → MLP → output. Nothing is hidden.",
        "The attention view shows which earlier words each token is 'looking at' to decide what comes next.",
      ],
      try: [
        "Type 'The capital of France is' and read the top predicted token.",
        "Raise the temperature slider and watch the probability mass spread to weirder tokens — the same dial our Temperature demo teaches.",
        "Change one word early in the sentence and see how far downstream the attention pattern shifts.",
      ],
    },
  },
  {
    id: "llm-viz",
    title: "LLM Visualization (3D walkthrough)",
    source: "Brendan Bycroft",
    url: "https://bbycroft.net/llm",
    module: "foundations",
    concept: "What's inside a GPT",
    blurb:
      "A full GPT rendered in 3D — every matrix, every step of inference, walked one operation at a time.",
    embed: true,
    guide: {
      look: [
        "This is the actual arithmetic of a tiny GPT — not a metaphor. Every box is a real tensor.",
        "Scroll the guided walkthrough: tokens become vectors, vectors flow through attention, and a prediction falls out the end.",
        "Notice how much of the model is just matrix multiplications repeated — scale, not magic.",
      ],
      try: [
        "Step through the embedding stage and see a token become a column of numbers.",
        "Find the self-attention block and watch one token gather context from the others.",
        "Jump to the output and connect it back to the probability bars in the Transformer Explainer.",
      ],
    },
  },
  {
    id: "tensorflow-playground",
    title: "TensorFlow Playground",
    source: "Google",
    url: "https://playground.tensorflow.org/",
    module: "foundations",
    concept: "How a neural network learns",
    blurb:
      "A neural network you can train by hand — add neurons, watch the loss fall, and see the decision boundary form in real time.",
    embed: true,
    guide: {
      look: [
        "The background colour is the network's current guess across the whole space — it sharpens as training runs.",
        "Each line's thickness is a weight; they change every step as the model learns.",
        "Watch the training and test loss curves — the gap between them is overfitting, made visible.",
      ],
      try: [
        "Pick the spiral dataset and hit play with one hidden layer — watch it struggle.",
        "Add a second hidden layer and more neurons, then re-run; the boundary curves to fit.",
        "Crank the learning rate too high and watch training go unstable — a failure mode you'll meet for real.",
      ],
    },
  },
  {
    id: "cnn-explainer",
    title: "CNN Explainer",
    source: "Polo Club, Georgia Tech",
    url: "https://poloclub.github.io/cnn-explainer/",
    module: "foundations",
    concept: "How a vision model sees",
    blurb:
      "An image classifier opened up — see how convolutions turn raw pixels into 'this is a bell pepper.'",
    embed: true,
    guide: {
      look: [
        "Hover any neuron to see exactly which patch of the image it responds to.",
        "Early layers detect edges and colour; later layers assemble them into shapes and objects.",
        "The final layer is just scores — the highest one is the prediction.",
      ],
      try: [
        "Click through the convolution animation and watch a filter slide across the image.",
        "Follow one bright activation from an early layer into the layers above it.",
        "Tie it to multimodal models: this is how an image becomes something a model can reason over.",
      ],
    },
  },
  {
    id: "seeing-theory",
    title: "Seeing Theory",
    source: "Brown University",
    url: "https://seeing-theory.brown.edu/",
    module: "foundations",
    concept: "Probability & sampling",
    blurb:
      "Probability you can play with — the statistics that sit underneath temperature, sampling, and every model output.",
    embed: true,
    guide: {
      look: [
        "Distributions here are interactive — drag and watch the numbers respond.",
        "The chapters on probability and distributions are the ground floor under 'the model samples a token.'",
        "Randomness with structure: that's exactly what an LLM does at each step.",
      ],
      try: [
        "Open 'Basic Probability' and run the simulations a few times to feel the law of large numbers.",
        "Explore a distribution and connect 'sampling from a distribution' to how temperature reshapes one.",
        "Come back to our Temperature demo and the dial will mean more.",
      ],
    },
  },
  {
    id: "diffusion-explainer",
    title: "Diffusion Explainer",
    source: "Polo Club, Georgia Tech",
    url: "https://poloclub.github.io/diffusion-explainer/",
    module: "models",
    concept: "How image generation works",
    blurb:
      "Stable Diffusion, made visible — watch a prompt steer pure noise into an image, step by step.",
    embed: true,
    guide: {
      look: [
        "Generation starts from random noise and is denoised toward the prompt — the opposite of how you'd guess.",
        "The text prompt is an embedding that guides every denoising step.",
        "Watch the image resolve over the steps; earlier steps fix layout, later ones add detail.",
      ],
      try: [
        "Change the prompt and watch the trajectory through noise change with it.",
        "Step the timeline manually to see how much arrives in the final few steps.",
        "Connect it to model choice: image generation is its own tool class, not an LLM.",
      ],
    },
  },
  {
    id: "gan-lab",
    title: "GAN Lab",
    source: "Polo Club, Georgia Tech",
    url: "https://poloclub.github.io/ganlab/",
    module: "models",
    concept: "Generative adversarial networks",
    blurb:
      "Two networks in a contest — train a generator and discriminator against each other and watch them reach balance.",
    embed: true,
    guide: {
      look: [
        "The generator tries to fake the real data distribution; the discriminator tries to catch it.",
        "Watch the fake samples (green) migrate toward the real distribution as training runs.",
        "Training is a moving target — neither network is allowed to 'win' for long.",
      ],
      try: [
        "Hit play and watch the generated cloud chase the real one.",
        "Pause early and late to compare how the distributions overlap over time.",
        "Note how unstable adversarial training is — a real-world reason GANs are hard to ship.",
      ],
    },
  },
];

export function getExplainer(id: string): Explainer | undefined {
  return explainers.find((e) => e.id === id);
}
