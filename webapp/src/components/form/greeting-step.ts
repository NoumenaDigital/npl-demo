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
                    <p>With NPL, you can build a complete API service and backend in 20 lines of code.</p>
                    <p>Focus on your core business logic while NPL Runtime automatically generates a full backend infrastructure with database integration.</p>
                    <ul class="feature-list">
                        <li><strong>Complete API Service</strong>: generated REST endpoints with OpenAPI specs</li>
                        <li><strong>Full Backend</strong>: built-in database ops and persistence layer</li>
                        <li><strong>Enterprise Security</strong>: fine-grained access control based on JWT</li>
                        <li><strong>Production Ready</strong>: automatic error handling and data integrity guarantees</li>
                    </ul>
                    <p>From simple to complex, NPL is the perfect tool for your next project.</p>
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
