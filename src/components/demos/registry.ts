import type { ComponentType } from "react";
import type { DemoId } from "../../data/types";
import { TokenizerDemo } from "./TokenizerDemo";
import { TemperatureDemo } from "./TemperatureDemo";
import { EmbeddingDemo } from "./EmbeddingDemo";
import { RagDemo } from "./RagDemo";
import { WorkflowDemo } from "./WorkflowDemo";
import { ModelMatrixDemo } from "./ModelMatrixDemo";
import { ReactLoopDemo } from "./ReactLoopDemo";
import { LcelChainDemo } from "./LcelChainDemo";
import { ContextWindowDemo } from "./ContextWindowDemo";
import { BackoffDemo } from "./BackoffDemo";
import { ContractDemo } from "./ContractDemo";

/** Demo components register here; ModulePage and Playground render from it. */
export const demoRegistry: Record<DemoId, ComponentType> = {
  tokenizer: TokenizerDemo,
  temperature: TemperatureDemo,
  embeddings: EmbeddingDemo,
  rag: RagDemo,
  workflow: WorkflowDemo,
  "model-matrix": ModelMatrixDemo,
  "react-loop": ReactLoopDemo,
  lcel: LcelChainDemo,
  "context-window": ContextWindowDemo,
  backoff: BackoffDemo,
  contract: ContractDemo,
};
