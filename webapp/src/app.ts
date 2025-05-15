import './style.css';
import {getAccessToken, getHelloWorld, getHelloWorldsCount, postHelloWorld, sayHello} from "./service.ts";
import type {HelloWorld} from "./models.ts";
import { jwtDecode } from "jwt-decode";

// Step management
enum Step {
  GREETING = 0,
  LOGIN = 1,
  CREATE_PROTOCOL = 2,
  SAY_HELLO = 3
}

// Application state
interface AppState {
  currentStep: Step;
  accessToken: string | null;
  protocolId: string | null;
  protocol: HelloWorld | null;
  protocolCount: number | null;
}

// Initialize app state
const appState: AppState = {
  currentStep: Step.GREETING,
  accessToken: null,
  protocolId: null,
  protocol: null,
  protocolCount: null
};

// Initialize the application
const initApp = () => {
  // Render the initial app structure
  renderAppStructure();

  // Render the first step
  renderCurrentStep();
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

// Render the current step based on app state
const renderCurrentStep = () => {
  const stepContainer = document.getElementById('stepContainer');
  if (!stepContainer) return;

  // Clear the step container
  stepContainer.innerHTML = '';

  // Render the appropriate step content
  switch (appState.currentStep) {
    case Step.GREETING:
      renderGreetingStep(stepContainer);
      break;
    case Step.LOGIN:
      renderLoginStep(stepContainer);
      break;
    case Step.CREATE_PROTOCOL:
      renderCreateProtocolStep(stepContainer);
      break;
    case Step.SAY_HELLO:
      renderSayHelloStep(stepContainer);
      break;
  }
};

// Step 1: Render greeting message
const renderGreetingStep = (container: HTMLElement) => {
  const template = document.getElementById('greetingTemplate') as HTMLTemplateElement;
  if (template) {
    const content = template.content.cloneNode(true) as DocumentFragment;
    container.appendChild(content);

    // Set up event listener for the start button
    const startButton = document.getElementById('startDemoButton');
    if (startButton) {
      startButton.addEventListener('click', () => {
        appState.currentStep = Step.LOGIN;
        renderCurrentStep();
      });
    }
  }
};

// Step 2: Render login screen
const renderLoginStep = (container: HTMLElement) => {
  const template = document.getElementById('loginTemplate') as HTMLTemplateElement;
  if (template) {
    const content = template.content.cloneNode(true) as DocumentFragment;
    container.appendChild(content);

    // Set up event listener for the login button
    const loginButton = document.getElementById('loginButton');
    const usernameInput = document.getElementById('usernameInput') as HTMLInputElement;
    const passwordInput = document.getElementById('passwordInput') as HTMLInputElement;
    const tokenResult = document.getElementById('tokenResult');

    if (loginButton && usernameInput && passwordInput && tokenResult) {
      loginButton.addEventListener('click', async () => {
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (username && password) {
          loginButton.disabled = true;
          tokenResult.textContent = 'Authenticating...';

          try {
            const token = await getAccessToken(username, password);
            appState.accessToken = token;

            // Decode the JWT token
            const decodedToken = jwtDecode(token);

            // Display only the decoded token
            tokenResult.innerHTML = `
              <div>Authentication successful!</div>
              <div class="decoded-token">
                <h3>Decoded JWT:</h3>
                <pre>${JSON.stringify(decodedToken, null, 2)}</pre>
              </div>
            `;

            // Add a button to proceed after showing the token
            const proceedButton = document.createElement('button');
            proceedButton.textContent = 'Continue to Create Protocol';
            proceedButton.className = 'proceed-button';
            proceedButton.addEventListener('click', () => {
              appState.currentStep = Step.CREATE_PROTOCOL;
              renderCurrentStep();
            });
            // Add the button after the token result, not inside it
            const stepContent = tokenResult.parentElement;
            if (stepContent) {
              stepContent.appendChild(proceedButton);
            }
          } catch (error) {
            console.error('Authentication error:', error);
            // Display error in a more user-friendly way
            tokenResult.innerHTML = `
              <div class="error-message">
                <h3>Authentication Failed</h3>
                <p>${error instanceof Error ? error.message : 'Failed to authenticate. Please try again.'}</p>
              </div>
            `;
            loginButton.disabled = false;
          }
        } else {
          tokenResult.textContent = 'Please enter both username and password.';
        }
      });
    }
  }
};

// Step 3: Render protocol creation screen
const renderCreateProtocolStep = (container: HTMLElement) => {
  const template = document.getElementById('protocolTemplate') as HTMLTemplateElement;
  if (template) {
    const content = template.content.cloneNode(true) as DocumentFragment;
    container.appendChild(content);

    // Fetch and display protocol count immediately
    (async () => {
      try {
        appState.protocolCount = await getHelloWorldsCount();
        const protocolCountElement = document.getElementById('protocolCount');
        if (protocolCountElement && appState.protocolCount !== null) {
          protocolCountElement.textContent = `Create a new instance of the Hello World Protocol. Don't be scared, ${appState.protocolCount} people preceeded you!`;
        }
      } catch (error) {
        console.error('Error fetching protocol count:', error);
      }
    })();

    // Set up event listener for the create protocol button
    const createButton = document.getElementById('createProtocolButton');
    const protocolResult = document.getElementById('protocolResult');

    if (createButton && protocolResult) {
      createButton.addEventListener('click', async () => {
        createButton.disabled = true;
        protocolResult.textContent = 'Creating protocol...';

        try {
          const protocol = await postHelloWorld();
          appState.protocol = protocol;
          appState.protocolId = protocol['@id'];

          // Get protocol count
          appState.protocolCount = await getHelloWorldsCount();

          // Display the protocol count
          const protocolCountElement = document.getElementById('protocolCount');
          if (protocolCountElement && appState.protocolCount !== null) {
            protocolCountElement.textContent = `Create a new instance of the Hello World Protocol. Don't be scared, ${appState.protocolCount} people preceeded you!`;
          }

          // Display the protocol response nicely formatted
          protocolResult.innerHTML = `Protocol created successfully!<br><pre class="json-output">${JSON.stringify(protocol, null, 2)}</pre>`;

          // Add a button to proceed after showing the protocol
          const proceedButton = document.createElement('button');
          proceedButton.textContent = 'Continue to Say Hello';
          proceedButton.className = 'proceed-button';
          proceedButton.addEventListener('click', () => {
            appState.currentStep = Step.SAY_HELLO;
            renderCurrentStep();
          });
          // Add the button after the protocol result, not inside it
          const stepContent = protocolResult.parentElement;
          if (stepContent) {
            stepContent.appendChild(proceedButton);
          }
        } catch (error) {
          console.error('Protocol creation error:', error);
          protocolResult.innerHTML = `<div class="error-message">
            <h3>Protocol Creation Failed</h3>
            <p>${error instanceof Error ? error.message : 'Failed to create protocol. Please try again.'}</p>
          </div>`;
          createButton.disabled = false;
        }
      });
    }
  }
};

// Step 4: Render say hello screen
const renderSayHelloStep = (container: HTMLElement) => {
  const template = document.getElementById('sayHelloTemplate') as HTMLTemplateElement;
  if (template) {
    const content = template.content.cloneNode(true) as DocumentFragment;
    container.appendChild(content);

    // Set up event listeners for the say hello button
    setupSayHelloEventListeners();
  }
};

// Set up event listeners for the say hello functionality
const setupSayHelloEventListeners = () => {
  const sayHelloButton = document.getElementById('sayHelloButton');
  const nameInput = document.getElementById('nameInput') as HTMLInputElement;
  const greetingResult = document.getElementById('greetingResult');

  if (sayHelloButton && nameInput && greetingResult && appState.protocolId) {
    sayHelloButton.addEventListener('click', async () => {
      const name = nameInput.value.trim();
      if (name) {
        greetingResult.textContent = 'Loading...';
        try {
          const greeting = await sayHello(appState.protocolId, name);
          greetingResult.textContent = greeting;
        } catch (error) {
          console.error('Error saying hello:', error);
          greetingResult.textContent = `Error: ${error instanceof Error ? error.message : 'Failed to say hello. Please try again.'}`;
        }
      } else {
        greetingResult.textContent = 'Please enter a name.';
      }
    });
  }
};

// Start the application
initApp();
