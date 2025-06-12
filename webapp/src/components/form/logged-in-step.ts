import { jwtDecode } from "jwt-decode";
import { html, render } from "lit-html";

export class LoggedInStep extends HTMLElement {
    private continueButtonHandler: ((event: Event) => void) | null = null;
    private backButtonHandler: ((event: Event) => void) | null = null;

    set accessToken(value: string) {
        this.render(value);
    }

    connectedCallback() {
        this.setupEventListeners();
    }

    disconnectedCallback() {
        this.removeEventListeners();
    }

    private render(accessToken: string) {
        render(this.template(accessToken), this);
    }

    private template(accessToken: string) {
        let tokenInfo = '';
        if (accessToken) {
            try {
                const decodedToken = jwtDecode(accessToken);
                tokenInfo = JSON.stringify(decodedToken, null, 2);
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        }

        return html`
            <div class="step-content">
                <h1>You are logged in</h1>
                <p>The authentication token (JWT) attributes include <code>preferred_username</code>, which is used to identify the user.</p>
                <div id="logged-in-token-info">
                    <pre class="token-info">${tokenInfo}</pre>
                </div>
                <div class="input-container">
                    <button id="backButton" class="back-button">Back</button>
                    <button id="loggedInButton">Continue to Create Protocol</button>
                </div>
            </div>
        `;
    }

    private setupEventListeners() {
        this.removeEventListeners();

        const loggedInButton = this.querySelector('#loggedInButton');
        if (loggedInButton) {
            this.continueButtonHandler = this.handleContinueClick.bind(this);
            loggedInButton.addEventListener('click', this.continueButtonHandler);
        }

        const backButton = this.querySelector('#backButton');
        if (backButton) {
            this.backButtonHandler = this.handleBackClick.bind(this);
            backButton.addEventListener('click', this.backButtonHandler);
        }
    }

    private removeEventListeners() {
        const loggedInButton = this.querySelector('#loggedInButton');
        if (loggedInButton && this.continueButtonHandler) {
            loggedInButton.removeEventListener('click', this.continueButtonHandler);
            this.continueButtonHandler = null;
        }

        const backButton = this.querySelector('#backButton');
        if (backButton && this.backButtonHandler) {
            backButton.removeEventListener('click', this.backButtonHandler);
            this.backButtonHandler = null;
        }
    }

    private handleBackClick() {
        this.dispatchEvent(new CustomEvent('previous-step', {
            bubbles: true,
            composed: true
        }));
    }

    private handleContinueClick() {
        this.dispatchEvent(new CustomEvent('next-step', {
            bubbles: true,
            composed: true
        }));
    }
}

customElements.define('logged-in-step', LoggedInStep);

declare global {
  interface HTMLElementTagNameMap {
    'logged-in-step': LoggedInStep;
  }
}
