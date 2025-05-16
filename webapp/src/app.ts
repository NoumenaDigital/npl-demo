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

  // Initialize the response container with a heading
  initResponseContainer();
};

// Initialize the response container
const initResponseContainer = () => {
  // No longer initializing with content - container should be empty initially
};

// Clear the response container completely
const clearResponseContainer = () => {
  const responseContainer = document.getElementById('responseContainer');
  if (responseContainer) {
    responseContainer.innerHTML = '';
  }
};

// Show the response container with heading and content
const showResponseContainer = (content: HTMLElement) => {
  const responseContainer = document.getElementById('responseContainer');
  if (responseContainer) {
    // Clear any existing content
    responseContainer.innerHTML = '';

    // Add the heading
    const heading = document.createElement('h2');
    heading.className = 'response-heading';
    heading.textContent = 'Server Response';
    responseContainer.appendChild(heading);

    // Add the new content
    responseContainer.appendChild(content);
  }
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
        clearResponseContainer();
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

    if (loginButton && usernameInput && passwordInput) {
      loginButton.addEventListener('click', async () => {
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (username && password) {
          loginButton.disabled = true;

          // Show authenticating status in the response container
          const statusElement = document.createElement('div');
          statusElement.className = 'response-info';
          statusElement.innerHTML = `
            <div class="loading-message">
              <h3>Authenticating...</h3>
              <p>Please wait while we authenticate your credentials.</p>
            </div>
          `;
          showResponseContainer(statusElement);

          try {
            const response = await getAccessToken(username, password);
            const { method, endpoint, statusCode } = response.requestInfo;

            // Create response info element
            const responseInfoElement = document.createElement('div');
            responseInfoElement.className = 'response-info';

            if (!response.ok) {
              // For unsuccessful responses, display the error response
              const errorBody = await response.json().catch(() => ({ error: response.statusText }));

              // Create the response HTML with error details
              responseInfoElement.innerHTML = `
                <div class="request-details">
                  <span class="method">${method}</span>
                  <span class="endpoint">${endpoint}</span>
                  <span class="status-code" data-status="${statusCode}">${statusCode}</span>
                </div>
                <pre class="json-output">${JSON.stringify(errorBody, null, 2)}</pre>
              `;

              showResponseContainer(responseInfoElement);
              loginButton.disabled = false;
              return;
            }

            const body = await response.json();
            const token = body.access_token as string;
            appState.accessToken = token;

            // Decode the JWT token
            const decodedToken = jwtDecode(token);

            // Create a modified body object with a decode button for access_token
            const modifiedBody = {...body};

            // Create the response HTML
            responseInfoElement.innerHTML = `
              <div class="request-details">
                <span class="method">${method}</span>
                <span class="endpoint">${endpoint}</span>
                <span class="status-code" data-status="${statusCode}">${statusCode}</span>
              </div>
              <pre id="json-output" class="json-output">${JSON.stringify(modifiedBody, null, 2)}</pre>
            `;

            showResponseContainer(responseInfoElement);

            // Add decode button functionality after the element is added to DOM
            const jsonOutput = document.getElementById('json-output');
            if (jsonOutput) {
              // Add a decode button next to the access_token
              const tokenRegex = /"access_token": "([^"]*)"/;
              const match = jsonOutput.innerHTML.match(tokenRegex);

              if (match) {
                const tokenValue = match[1];
                jsonOutput.innerHTML = jsonOutput.innerHTML.replace(
                  tokenRegex, 
                  `"access_token": "${tokenValue}" <button id="decode-token-btn" class="decode-token-btn">Decode Token</button>`
                );

                // Add event listener to the decode button
                setTimeout(() => {
                  const decodeButton = document.getElementById('decode-token-btn');
                  if (decodeButton) {
                    decodeButton.addEventListener('click', () => {
                      // Replace the token with the decoded token in proper JSON format
                      const formattedDecodedToken = JSON.stringify(decodedToken, null, 2)
                        .split('\n')
                        .map((line, index) => index === 0 ? line : '  ' + line)
                        .join('\n');

                      jsonOutput.innerHTML = jsonOutput.innerHTML.replace(
                        new RegExp(`"access_token": "${tokenValue}" <button[^>]*>Decode Token<\\/button>`),
                        `"access_token": ${formattedDecodedToken}`
                      );
                    });
                  }
                }, 0);
              }
            }

            // Add a button to proceed after successful authentication
            const proceedButton = document.createElement('button');
            proceedButton.textContent = 'Continue to Create Protocol';
            proceedButton.className = 'proceed-button';
            proceedButton.addEventListener('click', () => {
              clearResponseContainer();
              appState.currentStep = Step.CREATE_PROTOCOL;
              renderCurrentStep();
            });

            // Add the button to the step content
            const stepContent = document.querySelector('.step-content');
            if (stepContent) {
              stepContent.appendChild(proceedButton);
            }
          } catch (error) {
            console.error('Authentication error:', error);

            // Display error in the response container
            const errorElement = document.createElement('div');
            errorElement.className = 'response-info';
            errorElement.innerHTML = `
              <div class="error-message">
                <h3>Authentication Error</h3>
                <p>${error instanceof Error ? error.message : 'Failed to authenticate. Please try again.'}</p>
              </div>
            `;

            showResponseContainer(errorElement);

            loginButton.disabled = false;
          }
        } else {
          // Display validation error in the response container
          const validationElement = document.createElement('div');
          validationElement.className = 'response-info';
          validationElement.innerHTML = `
            <div class="error-message">
              <h3>Validation Error</h3>
              <p>Please enter both username and password.</p>
            </div>
          `;
          showResponseContainer(validationElement);
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

    // Set up event listener for the count button
    const countButton = document.getElementById('countButton');
    if (countButton) {
      countButton.addEventListener('click', async () => {
        // Display loading status in the response container
        const loadingElement = document.createElement('div');
        loadingElement.className = 'response-info';
        loadingElement.innerHTML = `
          <div class="loading-message">
            <h3>Loading...</h3>
            <p>Fetching protocol count information.</p>
          </div>
        `;
        showResponseContainer(loadingElement);

        try {
          const response = await getHelloWorldsCount();
          const { method, endpoint, statusCode } = response.requestInfo;

          if (!response.ok) {
            throw new Error(`Error: ${statusCode} - ${response.statusText}`);
          }

          const body = await response.json();
          appState.protocolCount = body.totalItems as number;

          // Update the button text with the count
          countButton.textContent = appState.protocolCount.toString();

          // Display request info
          const responseInfoElement = document.createElement('div');
          responseInfoElement.className = 'response-info';
          responseInfoElement.innerHTML = `
            <div class="request-details">
              <span class="method">${method}</span>
              <span class="endpoint">${endpoint}</span>
              <span class="status-code" data-status="${statusCode}">${statusCode}</span>
            </div>
            <pre class="json-output">${JSON.stringify(body, null, 2)}</pre>
          `;

          showResponseContainer(responseInfoElement);
        } catch (error) {
          console.error('Error fetching protocol count:', error);

          // Display error in the response container
          const errorElement = document.createElement('div');
          errorElement.className = 'response-info';
          errorElement.innerHTML = `
            <div class="error-message">
              <h3>Error Fetching Count</h3>
              <p>${error instanceof Error ? error.message : 'Failed to fetch protocol count. Please try again.'}</p>
            </div>
          `;
          showResponseContainer(errorElement);
        }
      });
    }

    // Set up event listener for the create protocol button
    const createButton = document.getElementById('createProtocolButton');

    if (createButton) {
      createButton.addEventListener('click', async () => {
        createButton.disabled = true;

        // Display creating status in the response container
        const statusElement = document.createElement('div');
        statusElement.className = 'response-info';
        statusElement.innerHTML = `
          <div class="loading-message">
            <h3>Creating Protocol...</h3>
            <p>Please wait while we create a new protocol instance.</p>
          </div>
        `;
        showResponseContainer(statusElement);

        try {
          const protocolResponse = await postHelloWorld();
          const { method, endpoint, statusCode } = protocolResponse.requestInfo;

          if (!protocolResponse.ok) {
            throw new Error(`Error: ${statusCode} - ${protocolResponse.statusText}`);
          }

          const protocol = await protocolResponse.json();
          appState.protocol = protocol;
          appState.protocolId = protocol['@id'];

          // Get protocol count
          const countResponse = await getHelloWorldsCount();
          if (!countResponse.ok) {
            throw new Error(`Error: ${countResponse.requestInfo.statusCode} - ${countResponse.statusText}`);
          }
          const countBody = await countResponse.json();
          appState.protocolCount = countBody.totalItems as number;

          // Update the count button text if it exists
          const countButton = document.getElementById('countButton');
          if (countButton) {
            countButton.textContent = appState.protocolCount.toString();
          }

          // Hide the create protocol button
          const createProtocolButton = document.getElementById('createProtocolButton');
          if (createProtocolButton) {
            createProtocolButton.style.display = 'none';
          }

          // Display the protocol response with request info and success message in the response container
          const responseInfoElement = document.createElement('div');
          responseInfoElement.className = 'response-info';
          responseInfoElement.innerHTML = `
            <div class="request-details">
              <span class="method">${method}</span>
              <span class="endpoint">${endpoint}</span>
              <span class="status-code" data-status="${statusCode}">${statusCode}</span>
            </div>
            <pre class="json-output">${JSON.stringify(protocol, null, 2)}</pre>
          `;

          showResponseContainer(responseInfoElement);

          // Add a button to proceed after showing the protocol
          const proceedButton = document.createElement('button');
          proceedButton.textContent = 'Continue to Say Hello';
          proceedButton.className = 'proceed-button';
          proceedButton.addEventListener('click', () => {
            clearResponseContainer();
            appState.currentStep = Step.SAY_HELLO;
            renderCurrentStep();
          });

          // Add the button to the step content
          const stepContent = document.querySelector('.step-content');
          if (stepContent) {
            stepContent.appendChild(proceedButton);
          }
        } catch (error) {
          console.error('Protocol creation error:', error);

          // Display error in the response container
          const errorElement = document.createElement('div');
          errorElement.className = 'response-info';
          errorElement.innerHTML = `
            <div class="error-message">
              <h3>Protocol Creation Error</h3>
              <p>${error instanceof Error ? error.message : 'Failed to create protocol. Please try again.'}</p>
            </div>
          `;
          showResponseContainer(errorElement);

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

  if (sayHelloButton && nameInput && appState.protocolId) {
    sayHelloButton.addEventListener('click', async () => {
      const name = nameInput.value.trim();
      if (name) {
        // Display loading status in the response container
        const loadingElement = document.createElement('div');
        loadingElement.className = 'response-info';
        loadingElement.innerHTML = `
          <div class="loading-message">
            <h3>Sending Hello...</h3>
            <p>Please wait while we process your greeting.</p>
          </div>
        `;
        showResponseContainer(loadingElement);

        try {
          const greetingResponse = await sayHello(appState.protocolId, name);
          const { method, endpoint, statusCode } = greetingResponse.requestInfo;
          const greetingBody = await greetingResponse.json();

          // Create response info element
          const responseInfoElement = document.createElement('div');
          responseInfoElement.className = 'response-info';

          // Determine message based on response type
          const message = typeof greetingBody === 'string' 
            ? greetingBody 
            : 'Hello request processed successfully!';

          // Format JSON body for display
          const jsonBody = typeof greetingBody === 'string' 
            ? { message: greetingBody } 
            : greetingBody;

          // Build HTML content based on response status
          if (!greetingResponse.ok) {
            responseInfoElement.innerHTML = `
              <div class="request-details">
                <span class="method">${method}</span>
                <span class="endpoint">${endpoint}</span>
                <span class="status-code" data-status="${statusCode}">${statusCode}</span>
              </div>
              <pre class="json-output">${JSON.stringify(greetingBody, null, 2)}</pre>
            `;
          } else {
            responseInfoElement.innerHTML = `
              <div class="request-details">
                <span class="method">${method}</span>
                <span class="endpoint">${endpoint}</span>
                <span class="status-code" data-status="${statusCode}">${statusCode}</span>
              </div>
              <pre class="json-output">${JSON.stringify(jsonBody, null, 2)}</pre>
            `;

            // Add "Again!" button and additional links section underneath the say hello bit after a successful 200 response
            if (statusCode === 200) {
              // Find the step content container
              const stepContent = document.querySelector('.step-content');
              if (stepContent) {
                // Remove any existing additional section to prevent duplicates
                const existingSection = stepContent.querySelector('.additional-section');
                if (existingSection) {
                  stepContent.removeChild(existingSection);
                }

                // Create the additional section
                const additionalSection = document.createElement('div');
                additionalSection.className = 'additional-section';
                additionalSection.innerHTML = `
                  <div class="additional-links">
                    <ul>
                      <li><a href="${import.meta.env.VITE_SERVER_URL}/swagger-ui/" target="_blank">Explore the other endpoints with Swagger</a></li>
                      <li><a href="https://documentation.noumenadigital.com/" target="_blank">Read the docs</a></li>
                    </ul>
                  </div>
                  <button id="startAgainButton" class="again-button">Take me to the start</button>
                `;

                // Append the additional section to the step content
                stepContent.appendChild(additionalSection);

                // Add event listener to the "Again!" button after it's added to the DOM
                setTimeout(() => {
                  const startAgainButton = document.getElementById('startAgainButton');
                  if (startAgainButton) {
                    startAgainButton.addEventListener('click', () => {
                      // Reset app state to initial step
                      appState.currentStep = Step.GREETING;
                      clearResponseContainer();
                      renderCurrentStep();
                    });
                  }
                }, 0);
              }
            }
          }

          // Update the response container
          showResponseContainer(responseInfoElement);
        } catch (error) {
          console.error('Error saying hello:', error);

          // Display error in the response container
          const errorElement = document.createElement('div');
          errorElement.className = 'response-info';
          errorElement.innerHTML = `
            <div class="error-message">
              <h3>Say Hello Error</h3>
              <p>${error instanceof Error ? error.message : 'Failed to say hello. Please try again.'}</p>
            </div>
          `;
          showResponseContainer(errorElement);
        }
      } else {
        // Display validation error in the response container
        const validationElement = document.createElement('div');
        validationElement.className = 'response-info';
        validationElement.innerHTML = `
          <div class="error-message">
            <h3>Validation Error</h3>
            <p>Please enter a name.</p>
          </div>
        `;
        showResponseContainer(validationElement);
      }
    });
  }
};

// Start the application
initApp();
