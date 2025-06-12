import { html, render } from "lit-html";

export class GreetingStep extends HTMLElement {
    private startButtonHandler: ((event: Event) => void) | null = null;

    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }

    disconnectedCallback() {
        this.removeEventListeners();
    }

    private render() {
        render(this.template(), this);
    }

    private template() {
        return html`
            <div class="step-content">
                <h1>Hello World Protocol Demo</h1>
                <div>
                    <p>Illustrating how to build a secure application with NPL in 20 lines:</p>
                    <ul class="feature-list">
                        <li><strong>Secure</strong>: fine-grained access rights based on JWT</li>
                        <li><strong>Safe</strong>: persistence and transaction integrity ensured automatically</li>
                        <li><strong>Simple & Convenient</strong>: generated endpoints and openAPI specs</li>
                    </ul>
                </div>

                <div class="input-container">
                    <button id="startDemoButton">Start Demo</button>
                </div>
            </div>
        `;
    }

    private setupEventListeners() {
        this.removeEventListeners();

        const startButton = this.querySelector('#startDemoButton');
        if (startButton) {
            this.startButtonHandler = this.handleStartClick.bind(this);
            startButton.addEventListener('click', this.startButtonHandler);
        }
    }

    private removeEventListeners() {
        const startButton = this.querySelector('#startDemoButton');
        if (startButton && this.startButtonHandler) {
            startButton.removeEventListener('click', this.startButtonHandler);
            this.startButtonHandler = null;
        }
    }

    private handleStartClick() {
        this.dispatchEvent(new CustomEvent('next-step', {
            bubbles: true,
            composed: true
        }));
    }
}

customElements.define('greeting-step', GreetingStep);

declare global {
  interface HTMLElementTagNameMap {
    'greeting-step': GreetingStep;
  }
}
