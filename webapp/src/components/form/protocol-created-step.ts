import { html, render } from "lit-html";
import { SERVER_URL } from "../../service";

export class ProtocolCreatedStep extends HTMLElement {
    private _protocolId: string | null = null;
    private nextButtonHandler: ((event: Event) => void) | null = null;
    private backButtonHandler: ((event: Event) => void) | null = null;

    set protocolId(value: string) {
        this._protocolId = value;
        this.render();
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }

    disconnectedCallback() {
        this.removeEventListeners();
    }

    private template(protocolId: string | null) {
        const getProtocolByIdEndpoint = html`<code>${SERVER_URL}/${protocolId || ''}/</code>`;
        const sayHelloEndpoint = html`<code>${SERVER_URL}/${protocolId || ''}/sayHello</code>`;
        return html`
            <div class="step-content">
                <h1>Protocol created</h1>

                <div>
                    <p>Well done!</p>
                    <p>You have successfully created a <code>Hello World</code> protocol instance attached to your <code>preferred_username</code>. 
                    Only the user you are logged in as and who got bound to the protocol instance you just created, can read the protocol's state and execute the <code>sayHello</code> action.</p>
                    ${protocolId ? html`
                        <p>To challenge this, call the get protocol by ID endpoint or the <code>sayHello</code> action directly using the protocol's unique ID: ${protocolId}.</p>
                        <p>Get protocol by ID: ${getProtocolByIdEndpoint}</p>
                        <p>Say Hello: ${sayHelloEndpoint}</p>
                    ` : ''}
                    <p>The protocol is in state <code>greeting</code> and the <code>sayHello</code> action is available to you. Go to the next step to execute the action.</p>
                </div>

                <div class="input-container">
                    <button id="backButton" class="back-button">Back</button>
                    <button id="createProtocolButton">Go to Say Hello</button>
                </div>
            </div>
        `;
    }

    private render() {
        render(this.template(this._protocolId), this);
    }

    private setupEventListeners() {
        this.removeEventListeners();

        const createProtocolButton = this.querySelector('#createProtocolButton');
        if (createProtocolButton) {
            this.nextButtonHandler = this.handleNextClick.bind(this);
            createProtocolButton.addEventListener('click', this.nextButtonHandler);
        }

        const backButton = this.querySelector('#backButton');
        if (backButton) {
            this.backButtonHandler = this.handleBackClick.bind(this);
            backButton.addEventListener('click', this.backButtonHandler);
        }
    }

    private removeEventListeners() {
        const createProtocolButton = this.querySelector('#createProtocolButton');
        if (createProtocolButton && this.nextButtonHandler) {
            createProtocolButton.removeEventListener('click', this.nextButtonHandler);
            this.nextButtonHandler = null;
        }

        const backButton = this.querySelector('#backButton');
        if (backButton && this.backButtonHandler) {
            backButton.removeEventListener('click', this.backButtonHandler);
            this.backButtonHandler = null;
        }
    }

    private handleNextClick() {
        this.dispatchEvent(new CustomEvent('show-response', {
            bubbles: true,
            composed: true,
            detail: undefined
        }));
        this.dispatchEvent(new CustomEvent('next-step', {
            bubbles: true,
            composed: true
        }));
    }

    private handleBackClick() {
        this.dispatchEvent(new CustomEvent('previous-step', {
            bubbles: true,
            composed: true
        }));
    }
}

customElements.define('protocol-created-step', ProtocolCreatedStep);

declare global {
    interface HTMLElementTagNameMap {
        'protocol-created-step': ProtocolCreatedStep;
    }
}
