import { Step, type AppState, type StepType } from '../types.ts';

export class AppStateManager {
  private state: AppState;
  private onStateChange: (state: AppState) => void;

  constructor(onStateChange: (state: AppState) => void) {
    this.state = {
      currentStep: Step.GREETING,
      accessToken: null,
      protocolId: null,
      protocol: null,
      protocolCount: null
    };
    this.onStateChange = onStateChange;
  }

  getState(): AppState {
    return this.state;
  }

  setStep(step: StepType): void {
    this.state.currentStep = step;
    this.onStateChange(this.state);
  }

  setAccessToken(token: string): void {
    this.state.accessToken = token;
    this.onStateChange(this.state);
  }

  setProtocol(protocol: any): void {
    this.state.protocol = protocol;
    this.state.protocolId = protocol['@id'];
    this.onStateChange(this.state);
  }

  setProtocolCount(count: number): void {
    this.state.protocolCount = count;
    this.onStateChange(this.state);
  }

  reset(): void {
    this.state = {
      currentStep: Step.GREETING,
      accessToken: null,
      protocolId: null,
      protocol: null,
      protocolCount: null
    };
    this.onStateChange(this.state);
  }
}