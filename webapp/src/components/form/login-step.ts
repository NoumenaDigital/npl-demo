import { jwtDecode } from "jwt-decode";
import { getAccessToken } from "../../service";
import { html, render } from "lit-html";

export class LoginStep extends HTMLElement {
    private loginHandler: ((event: Event) => void) | null = null;
    private backHandler: ((event: Event) => void) | null = null;

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
                <h1>Authentication</h1>
                <div>
                    <p>Log in to access the Hello World Protocol API. All endpoints are protected by fine-grained access control based on a JWT token, that users receive after successful authentication.</p>
                    <p><code>alice</code>, <code>bob</code> and <code>carol</code> are valid users for this demo. They share the same password, prepopulated in
                        the field below.</p>
                    <p>Start by logging in with one of the three users below. We will match users to the greeter party in the <code>Hello World</code> protocol upon protocol instantiation.</p>
                </div>
                <div class="form-container">
                    <div class="form-group">
                        <label for="usernameInput">Username:</label>
                        <select id="usernameInput">
                            <option value="alice" selected>alice</option>
                            <option value="bob">bob</option>
                            <option value="carol">carol</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="passwordInput">Password:</label>
                        <input type="text" id="passwordInput" value="password12345678" readonly>
                    </div>
                </div>
                <div class="input-container">
                    <button id="backButton" class="back-button">Back</button>
                    <button id="loginButton">Login</button>
                </div>
            </div>
        `;
    }

    private setupEventListeners() {
        this.removeEventListeners();

        const loginButton = this.querySelector('#loginButton');
        if (loginButton) {
            this.loginHandler = this.handleLoginClick.bind(this);
            loginButton.addEventListener('click', this.loginHandler);
        }

        const backButton = this.querySelector('#backButton');
        if (backButton) {
            this.backHandler = this.handleBackClick.bind(this);
            backButton.addEventListener('click', this.backHandler);
        }
    }

    private removeEventListeners() {
        const loginButton = this.querySelector('#loginButton');
        if (loginButton && this.loginHandler) {
            loginButton.removeEventListener('click', this.loginHandler);
            this.loginHandler = null;
        }

        const backButton = this.querySelector('#backButton');
        if (backButton && this.backHandler) {
            backButton.removeEventListener('click', this.backHandler);
            this.backHandler = null;
        }
    }

    private handleBackClick() {
        this.dispatchEvent(new CustomEvent('previous-step', {
            bubbles: true,
            composed: true
        }));
    }

    private async handleLoginClick() {
        const loginButton = this.querySelector('#loginButton') as HTMLButtonElement;
        const usernameInput = this.querySelector('#usernameInput') as HTMLInputElement;
        const passwordInput = this.querySelector('#passwordInput') as HTMLInputElement;

        if (import.meta.env.VITE_USER_PASSWORD) {
            passwordInput.value = import.meta.env.VITE_USER_PASSWORD;
        }

        if (loginButton && usernameInput && passwordInput) {
            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();

            if (username && password) {
                loginButton.disabled = true;

                this.dispatchEvent(new CustomEvent('show-response', {
                    bubbles: true,
                    composed: true,
                    detail: { 
                        type: 'loading',
                        message: 'Authenticating...',
                        description: 'Please wait while we authenticate your credentials.'
                    }
                }));

                try {
                    const response = await getAccessToken(username, password);
                    const { method, endpoint, statusCode } = response.requestInfo;

                    if (!response.ok) {
                        const errorBody = await response.json().catch(() => ({ error: response.statusText }));
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
                                body: errorBody
                            }
                        }));

                        loginButton.disabled = false;
                        return;
                    }

                    const body = await response.json();
                    const token = body.access_token as string;

                    this.dispatchEvent(new CustomEvent('set-access-token', {
                        bubbles: true,
                        composed: true,
                        detail: token
                    }));

                    const decodedToken = jwtDecode(token);

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
                            body: body,
                            decodedToken: decodedToken
                        }
                    }));

                    this.dispatchEvent(new CustomEvent('next-step', {
                        bubbles: true,
                        composed: true
                    }));
                } catch (error) {
                    console.error('Authentication error:', error);

                    this.dispatchEvent(new CustomEvent('show-response', {
                        bubbles: true,
                        composed: true,
                        detail: { 
                            type: 'error',
                            title: 'Authentication Error',
                            message: error instanceof Error ? error.message : 'Failed to authenticate. Please try again.'
                        }
                    }));

                    loginButton.disabled = false;
                }
            } else {
                this.dispatchEvent(new CustomEvent('show-response', {
                    bubbles: true,
                    composed: true,
                    detail: { 
                        type: 'error',
                        title: 'Validation Error',
                        message: 'Please enter both username and password.'
                    }
                }));
            }
        }
    }
}

customElements.define('login-step', LoginStep);

declare global {
  interface HTMLElementTagNameMap {
    'login-step': LoginStep;
  }
}
