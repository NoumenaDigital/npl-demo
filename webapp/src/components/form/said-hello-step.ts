import { html, render } from "lit-html";

export class SaidHelloStep extends HTMLElement {
    private startAgainHandler: ((event: Event) => void) | null = null;
    private backHandler: ((event: Event) => void) | null = null;

    connectedCallback() {
        this.render();
        this.setupButtonEventListeners();
    }

    disconnectedCallback() {
        this.removeEventListeners();
    }

    template() {
        return html`
            <div class="step-content">
                <h1>Success!</h1>
                <div>
                    <p>See below, you've been greeted! The <code>Hello World</code> protocol has returned the greeting message tailored to you. It is now in state greeted and cannot react to the sayHello permission anymore.</p>
                    <p>You are now ready to <a href="https://community.noumenadigital.com/t/congrats-you-have-completed-the-npl-demo/259" target="_blank" rel="noopener">claim your NPL DEMO completion badge</a> in the NOUMENA Community!</p>
                    <p>You have used most of the <code>Hello World</code> protocol's <a href="https://engine-public-npldemo.noumena.cloud/swagger-ui/index.html?urls.primaryName=NPL%20Application%20-%20demo">NPL API</a> for this example. That API comes out of the box when you run the NOUMENA Runtime locally and on NOUMENA Cloud. Continue your discovery journey <a href="https://documentation.noumenadigital.com" target="_blank" rel="noopener">in the documentation</a> to learn more.</p>
                    <p>Browse the code for this example <a href="https://github.com/NoumenaDigital/npl-demo" target="_blank" rel="noopener">here</a>.</p>
                </div>
                <div class="input-container">
                    <button id="backButton" class="back-button">Back</button>
                    <button id="startAgainButton" class="again-button">Take me to the start</button>
                </div>
            </div>
        `;
    }

    private render() {
        render(this.template(), this);
    }

    private setupButtonEventListeners() {
        this.removeEventListeners();

        const startAgainButton = this.querySelector('#startAgainButton');
        if (startAgainButton) {
            this.startAgainHandler = this.handleStartAgainClick.bind(this);
            startAgainButton.addEventListener('click', this.startAgainHandler);
        }

        const backButton = this.querySelector('#backButton');
        if (backButton) {
            this.backHandler = this.handleBackClick.bind(this);
            backButton.addEventListener('click', this.backHandler);
        }
    }

    private removeEventListeners() {
        const startAgainButton = this.querySelector('#startAgainButton');
        if (startAgainButton && this.startAgainHandler) {
            startAgainButton.removeEventListener('click', this.startAgainHandler);
            this.startAgainHandler = null;
        }

        const backButton = this.querySelector('#backButton');
        if (backButton && this.backHandler) {
            backButton.removeEventListener('click', this.backHandler);
            this.backHandler = null;
        }
    }

    private handleStartAgainClick() {
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

customElements.define('said-hello-step', SaidHelloStep);

declare global {
    interface HTMLElementTagNameMap {
        'said-hello-step': SaidHelloStep;
    }
}
