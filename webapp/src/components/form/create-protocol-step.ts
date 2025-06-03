import { postHelloWorld } from "../../service";
import { getHelloWorldsCount } from "../../service";
import { Step, type StepType } from "../../types";
import { jwtDecode } from "jwt-decode";

export class CreateProtocolStep {
  setStepAndRender: (step: StepType) => void;
  showResponseContainer: (container: HTMLElement) => void;
  clearResponseContainer: () => void;
  setProtocolCount: (count: number) => void;
  setProtocol: (id: string, protocol: any) => void;

  constructor(
    setStepAndRender: (step: StepType) => void,
    clearResponseContainer: () => void,
    showResponseContainer: (container: HTMLElement) => void,
    setProtocolCount: (count: number) => void,
    setProtocol: (id: string, protocol: any) => void
  ) {
    this.setStepAndRender = setStepAndRender;
    this.clearResponseContainer = clearResponseContainer;
    this.showResponseContainer = showResponseContainer;
    this.setProtocolCount = setProtocolCount;
    this.setProtocol = setProtocol;
  }

  render(container: HTMLElement, accessToken: string | null) {
    const template = document.getElementById('protocolTemplate') as HTMLTemplateElement;
    if (template) {
      const content = template.content.cloneNode(true) as DocumentFragment;
      container.appendChild(content);

      const usernameSpan = document.getElementById('usernameSpan');
      if (usernameSpan && accessToken) {
        const decodedToken = jwtDecode(accessToken) as any;
        usernameSpan.textContent = decodedToken.preferred_username;
      }

      // Set up event listener for the count button
      this.setupCountButtonEventListeners();

      // Set up event listener for the create protocol button
      this.setupCreateProtocolEventListeners();
    }
  }

  async getProtocolCount(countButton: HTMLElement) {
    // Display loading status in the response container
    const loadingElement = document.createElement('div');
    loadingElement.className = 'response-info';
    loadingElement.innerHTML = `
      <div class="loading-message">
        <h3>Loading...</h3>
        <p>Fetching protocol count information.</p>
      </div>
    `;
    this.showResponseContainer(loadingElement);

    try {
      const response = await getHelloWorldsCount();
      const { method, endpoint, statusCode } = response.requestInfo;

      if (!response.ok) {
        throw new Error(`Error: ${statusCode} - ${response.statusText}`);
      }

      const body = await response.json();
      const protocolNumber = body.totalItems as number;

      this.setProtocolCount(protocolNumber);

      // Update the button text with the count
      countButton.textContent = protocolNumber.toString();

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

      this.showResponseContainer(responseInfoElement);
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
      this.showResponseContainer(errorElement);
    }
  }

  setupCountButtonEventListeners() {
    const countButton = document.getElementById('countButton');
    if (countButton) {
      this.getProtocolCount(countButton)
      countButton.addEventListener('click', async () => this.getProtocolCount(countButton));
    }
  }

  setupCreateProtocolEventListeners() {
    const createButton = document.getElementById('createProtocolButton') as HTMLButtonElement;

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
        this.showResponseContainer(statusElement);

        try {
          const protocolResponse = await postHelloWorld();
          const { method, endpoint, statusCode } = protocolResponse.requestInfo;

          if (!protocolResponse.ok) {
            throw new Error(`Error: ${statusCode} - ${protocolResponse.statusText}`);
          }

          const protocol = await protocolResponse.json();
          this.setProtocol(protocol['@id'], protocol);

          // Get protocol count
          const countResponse = await getHelloWorldsCount();
          if (!countResponse.ok) {
            throw new Error(`Error: ${countResponse.requestInfo.statusCode} - ${countResponse.statusText}`);
          }
          const countBody = await countResponse.json();
          const protocolNumber = countBody.totalItems as number;
          this.setProtocolCount(protocolNumber);

          // Update the count button text if it exists
          const countButton = document.getElementById('countButton');
          if (countButton) {
            countButton.textContent = protocolNumber.toString();
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

          this.showResponseContainer(responseInfoElement);

          // Move to logged in step
          this.setStepAndRender(Step.PROTOCOL_CREATED);
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
          this.showResponseContainer(errorElement);

          createButton.disabled = false;
        }
      });
    }
  }
}