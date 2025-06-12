import { html, render } from "lit-html";

export class ProtocolCreatedStep extends HTMLElement {
    private nextButtonHandler: ((event: Event) => void) | null = null;
    private backButtonHandler: ((event: Event) => void) | null = null;

    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }

    disconnectedCallback() {
        this.removeEventListeners();
    }

    private template() {
        return html`
            <div class="step-content">
                <h1>Protocol created</h1>

                <div>
                    <p>Well done!</p>
                    <p>The protocol is now ready for you. The protocol is in state greeting and the sayHello action is
                        available to you.</p>
                    <p>The protocol's innovator party is bound to your preferred_username, so only you can access the
                        protocol instance and its sayHello action.</p>
                </div>

                <div class="input-container">
                    <button id="backButton" class="back-button">Back</button>
                    <button id="createProtocolButton">Go to Say Hello</button>
                </div>
            </div>
        `;
    }

    private render() {
        render(this.template(), this);
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
