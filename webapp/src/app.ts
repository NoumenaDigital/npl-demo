import './style.css';
import { Step, type AppComponents, type AppState, type StepType } from './types.ts';
import { StepsComponent } from './components/steps.ts';
import { ResponseComponent } from './components/response.ts';

// Initialize app state
const appState: AppState = {
  currentStep: Step.GREETING,
  accessToken: null,
  protocolId: null,
  protocol: null,
  protocolCount: null
};

const appComponents: AppComponents = {
  responseComponent: null,
  stepsComponent: null,
  codeComponent: null,
};

// Initialize the application
const initApp = () => {
  // Render the initial app structure
  renderAppStructure();

  // Initialize the current step
  initCurrentStep();

  // Render the first step
  renderCurrentStep();

  // Initialize the response container with a heading
  initResponseContainer();
};

const initCurrentStep = () => {
  appComponents.stepsComponent = new StepsComponent(appState, setStepAndRender, showResponseContainer, clearResponseContainer, setProtocolCount, setProtocol, setAccessToken);
}

// Initialize the response container
const initResponseContainer = () => {
  appComponents.responseComponent = new ResponseComponent();
};

// Clear the response container completely
const clearResponseContainer = () => {
  appComponents.responseComponent?.clear();
};

// Show the response container with heading and content
const showResponseContainer = (content: HTMLElement) => {
  appComponents.responseComponent?.render(content);
};  

// Render the app structure (code panel and step container)
const renderAppStructure = () => {
  const appTemplate = document.getElementById('appTemplate') as HTMLTemplateElement;
  const codeTemplate = document.getElementById('codeTemplate') as HTMLTemplateElement;

  if (appTemplate && codeTemplate) {
    // Clone the template content
    const appContent = appTemplate.content.cloneNode(true) as DocumentFragment;

    // Get code content
    const codeContent = codeTemplate.content.cloneNode(true);

    // Set dynamic content
    const codeElement = appContent.querySelector('#codeContent');
    if (codeElement) {
      // Clear existing content
      codeElement.innerHTML = '';
      // Append the cloned content
      codeElement.appendChild(codeContent);
    }

    // Clear and append to app div
    const appDiv = document.querySelector<HTMLDivElement>('#app');
    if (appDiv) {
      appDiv.innerHTML = '';
      appDiv.appendChild(appContent);
    }
  }
};

const renderCurrentStep = () => {
  appComponents.stepsComponent?.renderCurrentStep();
}

const setStepAndRender = (step: StepType) => {
  appState.currentStep = step;
  appComponents.stepsComponent?.renderCurrentStep();
}

const setAccessToken = (token: string) => {
  appState.accessToken = token;
}

const setProtocolCount = (count: number) => {
  appState.protocolCount = count;
}

const setProtocol = (id: string, protocol: any) => {
  appState.protocolId = id;
  appState.protocol = protocol;
}

// Start the application
initApp();
