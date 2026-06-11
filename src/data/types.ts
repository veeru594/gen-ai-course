export type ModuleId =
  | "foundations"
  | "automation"
  | "models"
  | "agents"
  | "python";

export type DemoId =
  | "tokenizer"
  | "temperature"
  | "workflow"
  | "model-matrix"
  | "react-loop"
  | "contract";

export interface TopicRow {
  topic: string;
  meaning: string;
}

export interface CodeSnippet {
  language: string;
  label: string;
  code: string;
}

export interface Session {
  id: string;
  title: string;
  paragraphs: string[];
  topics: TopicRow[];
  code?: CodeSnippet;
}

export interface Concept {
  term: string;
  definition: string;
}

export type ExerciseLevel = "STARTER" | "BUILD" | "SHIP";

export interface Exercise {
  id: string;
  level: ExerciseLevel;
  text: string;
}

export interface Resource {
  label: string;
  url: string;
  purpose: string;
  module: ModuleId | "general";
}

export interface DemoSpec {
  id: DemoId;
  title: string;
  lede: string;
  /** index into sessions[] after which the demo renders */
  afterSession: number;
}

export interface Module {
  id: ModuleId;
  number: string;
  title: string;
  hours: number;
  tagline: string;
  intro: string[];
  sessions: Session[];
  demo: DemoSpec;
  concepts: Concept[];
  exercises: Exercise[];
  resources: Resource[];
}
