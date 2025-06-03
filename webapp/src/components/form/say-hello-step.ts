import { sayHello } from "../../service";
import { Step, type StepType } from "../../types";

export class SayHelloStep {
    setStepAndRender: (step: StepType) => void;
    clearResponseContainer: () => void;
    showResponseContainer: (container: HTMLElement) => void;

    constructor(
        setStepAndRender: (step: StepType) => void,
        clearResponseContainer: () => void,
        showResponseContainer: (container: HTMLElement) => void
    ) {
        this.setStepAndRender = setStepAndRender;
        this.clearResponseContainer = clearResponseContainer;
        this.showResponseContainer = showResponseContainer;
    }

    render(container: HTMLElement, protocolId: string | null) {
        const template = document.getElementById('sayHelloTemplate') as HTMLTemplateElement;
        if (template) {
            const content = template.content.cloneNode(true) as DocumentFragment;
            container.appendChild(content);

            // Set up event listeners for the say hello button
            this.setupSayHelloEventListeners(protocolId);
        }
    }

    // Set up event listeners for the say hello functionality
    setupSayHelloEventListeners(protocolId: string | null) {
        const sayHelloButton = document.getElementById('sayHelloButton');

        if (sayHelloButton && protocolId) {
            sayHelloButton.addEventListener('click', async () => {
                // Display loading status in the response container
                const loadingElement = document.createElement('div');
                loadingElement.className = 'response-info';
                loadingElement.innerHTML = `
                    <div class="loading-message">
                    <h3>Sending Hello...</h3>
                    <p>Please wait while we process your greeting.</p>
                    </div>
                `;
                this.showResponseContainer(loadingElement);

                try {
                    // Ensure protocolId is not null before calling sayHello
                    if (!protocolId) {
                        throw new Error("Protocol ID is missing");
                    }
                    const greetingResponse = await sayHello(protocolId);
                    const { method, endpoint, statusCode } = greetingResponse.requestInfo;
                    const greetingBody = await greetingResponse.json();

                    // Create response info element
                    const responseInfoElement = document.createElement('div');
                    responseInfoElement.className = 'response-info';

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

                        if (statusCode === 200) {
                            this.setStepAndRender(Step.SAID_HELLO);
                        }
                    }

                    // Update the response container
                    this.showResponseContainer(responseInfoElement);
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
                    this.showResponseContainer(errorElement);
                }
            });
        }
    };
}