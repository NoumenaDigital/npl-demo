import { jwtDecode } from "jwt-decode";
import { getAccessToken } from "../../service";
import { Step, type StepType } from "../../types";

export class LoginStep {
    setStepAndRender: (step: StepType) => void;
    showResponseContainer: (container: HTMLElement) => void;
    setAccessToken: (token: string) => void

    constructor(
        setStepAndRender: (step: StepType) => void,
        showResponseContainer: (container: HTMLElement) => void,
        setAccessToken: (token: string) => void,
    ) {
        this.setStepAndRender = setStepAndRender;
        this.showResponseContainer = showResponseContainer;
        this.setAccessToken = setAccessToken;
    }

    render(container: HTMLElement) {
        const template = document.getElementById('loginTemplate') as HTMLTemplateElement;
        if (template) {
            const content = template.content.cloneNode(true) as DocumentFragment;
            container.appendChild(content);

            // Set up event listener for the login button
            this.setupLoginButtonEventListeners();
        }
    }

    setupLoginButtonEventListeners() {
        const loginButton = document.getElementById('loginButton') as HTMLButtonElement;
        const usernameInput = document.getElementById('usernameInput') as HTMLInputElement;
        const passwordInput = document.getElementById('passwordInput') as HTMLInputElement;
        passwordInput.value = import.meta.env.VITE_USER_PASSWORD;

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
                    this.showResponseContainer(statusElement);

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

                            this.showResponseContainer(responseInfoElement);
                            loginButton.disabled = false;
                            return;
                        }

                        const body = await response.json();
                        const token = body.access_token as string;
                        this.setAccessToken(token)

                        // Decode the JWT token
                        const decodedToken = jwtDecode(token);

                        // Create a modified body object with a decode button for access_token
                        const modifiedBody = { ...body };

                        // Create the response HTML
                        responseInfoElement.innerHTML = `
                            <div class="request-details">
                                <span class="method">${method}</span>
                                <span class="endpoint">${endpoint}</span>
                                <span class="status-code" data-status="${statusCode}">${statusCode}</span>
                            </div>
                            <pre id="json-output" class="json-output">${JSON.stringify(modifiedBody, null, 2)}</pre>
                            `;

                        this.showResponseContainer(responseInfoElement);

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

                        // Move to logged in step
                        this.setStepAndRender(Step.LOGGED_IN)
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

                        this.showResponseContainer(errorElement);

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
                    this.showResponseContainer(validationElement);
                }
            });
        }
    }
}