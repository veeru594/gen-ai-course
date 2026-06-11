import type { Module, ModuleId } from "./types";
import { foundations } from "./modules/foundations";
import { automation } from "./modules/automation";
import { models } from "./modules/models";
import { agents } from "./modules/agents";
import { python } from "./modules/python";

export const modules: Module[] = [
  foundations,
  automation,
  models,
  agents,
  python,
];

export function getModule(id: string | undefined): Module | undefined {
  return modules.find((m) => m.id === id);
}

export const programHours = {
  theory: 220,
  employability: 90,
  lab: 200,
  capstone: 30,
  total: 540,
} as const;

export const moduleOrder: ModuleId[] = [
  "foundations",
  "automation",
  "models",
  "agents",
  "python",
];
