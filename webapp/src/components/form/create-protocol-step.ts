import { postHelloWorld } from "../../service";
import { getHelloWorldsCount } from "../../service";
import { jwtDecode } from "jwt-decode";
import { html, render } from "lit-html";

export class CreateProtocolStep extends HTMLElement {
  private _accessToken?: string
  private _username: string = '';
  private _helloWorldsCount: number = 0;
  private createButtonClickHandler: ((event: Event) => void) | null = null;
  private backButtonClickHandler: ((event: Event) => void) | null = null;

  set accessToken(value: string) {
    this._accessToken = value;
    const decodedToken = jwtDecode(value) as any;
    this._username = decodedToken.preferred_username || '';

    this.getProtocolCount(value).then(it => {
      this._helloWorldsCount = it;
      this.render()
    })
  }

  async connectedCallback() {
    this.render();
    this.setupCreateProtocolEventListeners();
  }

  disconnectedCallback() {
    this.removeEventListeners();
  }

  template(username: string, helloWorldsCount: number) {
    return html`
      <div class="step-content">
        <h1>Create Protocol</h1>
        <div>
          <p>Create a new instance of the Hello World protocol. The instance will be created in the npl-demo app on NOUMENA Cloud. But you could also run the app locally.</p>
          <p>The button below uses an endpoint automatically generated out of the NPL code to instantiate a Hello World protocol. Your preferred_username will be bound to the innovator party to prevent access to everyone else.</p>
          <p>If you see pre-existing Hello World instances, it is because users preceded you as <span id="usernameSpan">${username}</span> on <span style="font-weight: bold">${helloWorldsCount}</span> occasions.</p>
        </div>

        <div class="input-container">
          <button id="backButton" class="back-button">Back</button>
          <button id="createProtocolButton">Create Protocol</button>
        </div>
      </div>
    `;
  }

  private render() {
      render(this.template(this._username, this._helloWorldsCount), this);
  }

  async getProtocolCount(accessToken: string): Promise<number> {
    const response = await getHelloWorldsCount(accessToken);
    const { method, endpoint, statusCode } = response.requestInfo;

    const body = await response.json();

    this.dispatchEvent(new CustomEvent('show-response', {
      bubbles: true,
      composed: true,
      detail: {
        type: 'api-response',
        requestInfo: {
          method,
          endpoint,
          statusCode
        },
        body: body
      }
    }));

    return body.totalItems as number || 0
  }

  setupCreateProtocolEventListeners() {
    this.removeCreateProtocolEventListeners();

    const createButton = this.querySelector('#createProtocolButton') as HTMLButtonElement;
    if (createButton) {
      this.createButtonClickHandler = this.handleCreateProtocolClick.bind(this);
      createButton.addEventListener('click', this.createButtonClickHandler);
    }

    const backButton = this.querySelector('#backButton') as HTMLButtonElement;
    if (backButton) {
      this.backButtonClickHandler = this.handleBackClick.bind(this);
      backButton.addEventListener('click', this.backButtonClickHandler);
    }
  }

  removeCreateProtocolEventListeners() {
    const createButton = this.querySelector('#createProtocolButton');
    if (createButton && this.createButtonClickHandler) {
      createButton.removeEventListener('click', this.createButtonClickHandler);
      this.createButtonClickHandler = null;
    }

    const backButton = this.querySelector('#backButton');
    if (backButton && this.backButtonClickHandler) {
      backButton.removeEventListener('click', this.backButtonClickHandler);
      this.backButtonClickHandler = null;
    }
  }

  removeEventListeners() {
    this.removeCreateProtocolEventListeners();
  }

  private handleBackClick() {
    this.dispatchEvent(new CustomEvent('previous-step', {
      bubbles: true,
      composed: true
    }));
  }

  private async handleCreateProtocolClick() {
    const createButton = this.querySelector('#createProtocolButton') as HTMLButtonElement;
    if (createButton) {
      createButton.disabled = true;
    }

    this.dispatchEvent(new CustomEvent('show-response', {
      bubbles: true,
      composed: true,
      detail: { 
        type: 'loading',
        message: 'Creating Protocol...',
        description: 'Please wait while we create a new protocol instance.'
      }
    }));

    try {
      const protocolResponse = await postHelloWorld(this._accessToken!);
      const { method, endpoint, statusCode } = protocolResponse.requestInfo;

      if (!protocolResponse.ok) {
        throw new Error(`Error: ${statusCode} - ${protocolResponse.statusText}`);
      }

      const protocol = await protocolResponse.json();

      this.dispatchEvent(new CustomEvent<string>('set-protocol-id', {
        bubbles: true,
        composed: true,
        detail: protocol['@id']
      }))

      this.dispatchEvent(new CustomEvent('show-response', {
        bubbles: true,
        composed: true,
        detail: { 
          type: 'api-response',
          requestInfo: {
            method,
            endpoint,
            statusCode
          },
          body: protocol
        }
      }));

      this.dispatchEvent(new CustomEvent('next-step', {
        bubbles: true,
        composed: true
      }));
    } catch (error) {
      console.error('Protocol creation error:', error);

      this.dispatchEvent(new CustomEvent('show-response', {
        bubbles: true,
        composed: true,
        detail: { 
          type: 'error',
          title: 'Protocol Creation Error',
          message: error instanceof Error ? error.message : 'Failed to create protocol. Please try again.'
        }
      }));

      if (createButton) {
        createButton.disabled = false;
      }
    }
  }
}

customElements.define('create-protocol-step', CreateProtocolStep);

declare global {
  interface HTMLElementTagNameMap {
    'create-protocol-step': CreateProtocolStep;
  }
}
