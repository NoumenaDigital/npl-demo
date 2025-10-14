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
                const decodedToken = jwtDecode(accessToken) as any;
                tokenInfo = JSON.stringify({
                    "iss": decodedToken.iss,
                    "sub": decodedToken.sub,
                    "name": decodedToken.name,
                    "preferred_username": decodedToken.preferred_username,
                    "given_name": decodedToken.given_name,
                    "email": decodedToken.email
                }, null, 2);
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        }

        return html`
            <div class="step-content">
                <h1>You are logged in</h1>
                <p>User attributes are stored in the authorization token (JWT). They include the <code>preferred_username</code>, which is used to identify the user in this demo. On the next screen we will instantiate the <code>Hello World</code> protocol to see how the <code>preferred_username</code> is attached to the greeter party.</p>
                <p>Other attributes are available in the token, but not used in this demo. They can be used to implement fine-grained access control.</p>
                <div id="logged-in-token-info">
                    <pre class="token-info">${tokenInfo}</pre>
                </div>
                <div class="input-container">
                    <button id="backButton" class="back-button">Back</button>
                    <button id="loggedInButton">Continue to Instantiate Protocol</button>
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
