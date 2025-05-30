import { Step, type AppState, type StepType } from '../types.ts';
import { LoggedInStep, CreateProtocolStep, ProtocolCreatedStep, SayHelloStep, SaidHelloStep, GreetingStep, LoginStep } from './form/index.ts';

export class StepsComponent {
  greetingStep: GreetingStep;
  loginStep: LoginStep;
  loggedInStep: LoggedInStep;
  CreateProtocolStep: CreateProtocolStep;
  protocolCreatedStep: ProtocolCreatedStep;
  sayHelloStep: SayHelloStep;
  saidHelloStep: SaidHelloStep;
  appState: AppState;
  showResponse: (content: HTMLElement) => void;
  clearResponse: () => void;
  setProtocolCount: (count: number) => void;
  setProtocol: (id: string, protocol: any) => void;
  setAccessToken: (token: string) => void;

  constructor(
    appState: AppState,
    setStepAndRender: (step: StepType) => void,
    showResponse: (content: HTMLElement) => void,
    clearResponse: () => void,
    setProtocolCount: (count: number) => void,
    setProtocol: (id: string, protocol: any) => void,
    setAccessToken: (token: string) => void,
  ) {

    this.appState = appState;
    this.showResponse = showResponse;
    this.clearResponse = clearResponse;
    this.setProtocolCount = setProtocolCount;
    this.setProtocol = setProtocol;
    this.setAccessToken = setAccessToken;

    this.greetingStep = new GreetingStep(
      setStepAndRender,
      clearResponse
    );

    this.loginStep = new LoginStep(
      setStepAndRender,
      showResponse,
      setAccessToken
    );

    this.loggedInStep = new LoggedInStep(
      setStepAndRender,
      this.clearResponse
    );

    this.CreateProtocolStep = new CreateProtocolStep(
      setStepAndRender,
      clearResponse,
      showResponse,
      setProtocolCount,
      setProtocol
    );

    this.protocolCreatedStep = new ProtocolCreatedStep(
      setStepAndRender,
      clearResponse
    );

    this.sayHelloStep = new SayHelloStep(
      setStepAndRender,
      clearResponse,
      showResponse
    );

    this.saidHelloStep = new SaidHelloStep(
      setStepAndRender,
      clearResponse
    );
  }

  renderCurrentStep() {
    const container = document.getElementById('stepContainer')!;

    if (!container) return;
    // Clear the container
    container.innerHTML = '';
    
    // Render the appropriate step content
    switch (this.appState.currentStep) {
      case Step.GREETING:
        this.renderGreeting(container);
        break;
      case Step.LOGIN:
        this.renderLogin(container);
        break;
      case Step.LOGGED_IN:
        this.renderLoggedIn(container, this.appState.accessToken);
        break
      case Step.CREATE_PROTOCOL:
        this.renderCreateProtocol(container);
        break;
      case Step.PROTOCOL_CREATED:
        this.renderProtocolCreated(container);
        break;
      case Step.SAY_HELLO:
        this.renderSayHello(container, this.appState.protocolId);
        break;
      case Step.SAID_HELLO:
        this.renderSaidHello(container);
        break;
    }
  };

  renderGreeting(container: HTMLElement): void {
    this.greetingStep.render(container);
  }

  renderLogin(container: HTMLElement): void {
    this.loginStep.render(container);
  }

  renderLoggedIn(container: HTMLElement, accessToken: string | null): void {
    this.loggedInStep.render(container, accessToken);
  }

  renderCreateProtocol(container: HTMLElement): void {
    this.CreateProtocolStep.render(container);
  }

  renderProtocolCreated(container: HTMLElement): void {
    this.protocolCreatedStep.render(container);
  }

  renderSayHello(container: HTMLElement, protocolId: string | null): void {
    this.sayHelloStep.render(container, protocolId);
  }

  renderSaidHello(container: HTMLElement): void {
    this.saidHelloStep.render(container);
  }
}