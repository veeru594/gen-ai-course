import type { ComponentType } from "react";
import type { DemoId } from "../../data/types";

/** Demo components register here; ModulePage and Playground render from it. */
export const demoRegistry: Partial<Record<DemoId, ComponentType>> = {};
