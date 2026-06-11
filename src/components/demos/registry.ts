import type { ComponentType } from "react";
import type { DemoId } from "../../data/types";
import { TokenizerDemo } from "./TokenizerDemo";
import { TemperatureDemo } from "./TemperatureDemo";
import { WorkflowDemo } from "./WorkflowDemo";
import { ModelMatrixDemo } from "./ModelMatrixDemo";
import { ReactLoopDemo } from "./ReactLoopDemo";
import { ContractDemo } from "./ContractDemo";

/** Demo components register here; ModulePage and Playground render from it. */
export const demoRegistry: Record<DemoId, ComponentType> = {
  tokenizer: TokenizerDemo,
  temperature: TemperatureDemo,
  workflow: WorkflowDemo,
  "model-matrix": ModelMatrixDemo,
  "react-loop": ReactLoopDemo,
  contract: ContractDemo,
};
