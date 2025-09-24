import { sayHello } from "../../service";
import { html, render } from "lit-html";

export class SayHelloStep extends HTMLElement {
    private _protocolId: string | null = null;
    private _accessToken?: string
    private _greetee: string = '';
    private sayHelloHandler: ((event: Event) => void) | null = null;
    private backHandler: ((event: Event) => void) | null = null;
    private inputHandler: ((event: Event) => void) | null = null;

    set protocolId(value: string | null) {
        this._protocolId = value;
        this.render();
    }

    set accessToken(value: string) {
        this._accessToken = value;
    }

    connectedCallback() {
        this.render();
    }

    disconnectedCallback() {
        this.removeEventListeners();
    }

    template() {
        return html`
            <div class="step-content">
                <h1>Call the permission</h1>
                <div>
                    <p>Are you ready for your first Hello World in NPL?</p>
                    <p>
                        The endpoint generated from the permission will allow you to say hello.
                        But only <em>you</em> can. Other users cannot access your Hello World
                        protocol.
                    </p>
                </div>

                <div class="input-section">
                    <label for="greeteeInput">Who would you like to greet?</label>
                    <input 
                        id="greeteeInput" 
                        type="text" 
                        placeholder="Enter a name..." 
                        value="${this._greetee}"
                        class="greetee-input"
                    />
                </div>

                <div class="input-container">
                    <button id="backButton" class="back-button">Back</button>
                    <button id="sayHelloButton" ?disabled="${!this._greetee.trim()}">Say Hello</button>
                </div>
            </div>
        `;
    }

    private render() {
        render(this.template(), this);
        this.setupSayHelloEventListeners();
    }

    private setupSayHelloEventListeners() {
        this.removeEventListeners();

        const sayHelloButton = this.querySelector('#sayHelloButton');
        if (sayHelloButton) {
            this.sayHelloHandler = this.handleSayHelloClick.bind(this);
            sayHelloButton.addEventListener('click', this.sayHelloHandler);
        }

        const backButton = this.querySelector('#backButton');
        if (backButton) {
            this.backHandler = this.handleBackClick.bind(this);
            backButton.addEventListener('click', this.backHandler);
        }

        const greeteeInput = this.querySelector('#greeteeInput') as HTMLInputElement;
        if (greeteeInput) {
            this.inputHandler = this.handleInputChange.bind(this);
            greeteeInput.addEventListener('input', this.inputHandler);
        }
    }

    private removeEventListeners() {
        const sayHelloButton = this.querySelector('#sayHelloButton');
        if (sayHelloButton && this.sayHelloHandler) {
            sayHelloButton.removeEventListener('click', this.sayHelloHandler);
            this.sayHelloHandler = null;
        }

        const backButton = this.querySelector('#backButton');
        if (backButton && this.backHandler) {
            backButton.removeEventListener('click', this.backHandler);
            this.backHandler = null;
        }

        const greeteeInput = this.querySelector('#greeteeInput');
        if (greeteeInput && this.inputHandler) {
            greeteeInput.removeEventListener('input', this.inputHandler);
            this.inputHandler = null;
        }
    }

    private handleInputChange(event: Event) {
        const input = event.target as HTMLInputElement;
        this._greetee = input.value;
        this.render();
    }

    private handleBackClick() {
        this.dispatchEvent(new CustomEvent('previous-step', {
            bubbles: true,
            composed: true
        }));
    }

    private async handleSayHelloClick() {
        this.dispatchEvent(new CustomEvent('show-response', {
            bubbles: true,
            composed: true,
            detail: { 
                type: 'loading',
                message: 'Sending Hello...',
                description: 'Please wait while we process your greeting.'
            }
        }));

        try {
            if (!this._protocolId) {
                throw new Error("Protocol ID is missing");
            }

            const greetingResponse = await sayHello(this._protocolId, this._accessToken!, this._greetee);
            const { method, endpoint, statusCode } = greetingResponse.requestInfo;
            const greetingBody = await greetingResponse.json();

            const jsonBody = typeof greetingBody === 'string'
                ? { message: greetingBody }
                : greetingBody;

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
                    body: jsonBody
                }
            }));

            if (statusCode === 200) {
                this.dispatchEvent(new CustomEvent('next-step', {
                    bubbles: true,
                    composed: true
                }));
            }
        } catch (error) {
            console.error('Error saying hello:', error);

            this.dispatchEvent(new CustomEvent('show-response', {
                bubbles: true,
                composed: true,
                detail: { 
                    type: 'error',
                    title: 'Say Hello Error',
                    message: error instanceof Error ? error.message : 'Failed to say hello. Please try again.'
                }
            }));
        }
    }
}

customElements.define('say-hello-step', SayHelloStep);

declare global {
    interface HTMLElementTagNameMap {
        'say-hello-step': SayHelloStep;
    }
}
