import type { CodePreviewComponent } from "./components/code-preview.ts";
import type { ResponseComponent } from "./components/response.ts";
import type { StepsComponent } from "./components/steps.ts";
import type { HelloWorld } from "./models.ts";

export const Step = {
  GREETING: 0,
  LOGIN: 1,
  LOGGED_IN: 2,
  CREATE_PROTOCOL: 3,
  PROTOCOL_CREATED: 4,
  SAY_HELLO: 5,
  SAID_HELLO: 6,
} as const;

export type StepType = typeof Step[keyof typeof Step];

export interface AppState {
  currentStep: StepType;
  accessToken: string | null;
  protocolId: string | null;
  protocol: HelloWorld | null;
  protocolCount: number | null;
}

export interface AppComponents {
  responseComponent: ResponseComponent | null;
  stepsComponent: StepsComponent | null;
  codeComponent: CodePreviewComponent | null;
}