import {html, render} from 'lit-html';
import './form/greeting-step.ts';
import './form/login-step.ts';
import './form/logged-in-step.ts';
import './form/create-protocol-step.ts';
import './form/protocol-created-step.ts';
import './form/say-hello-step.ts';
import './form/said-hello-step.ts';
import type { Step } from '../types.ts';

export class StepsComponent extends HTMLElement {
    _step?: Step;
    _accessToken?: string
    _protocolId?: string
    private accessTokenHandler: ((it: CustomEvent<string>) => void) | null = null;
    private protocolIdHandler: ((it: CustomEvent<string>) => void) | null = null;

    set step(value: Step) {;
        this._step = value
        this.render(this._step, this._protocolId)
    }

    connectedCallback() {
        this.accessTokenHandler = (it: CustomEvent<string>) => {
            this._accessToken = it.detail
        };
        this.protocolIdHandler = (it: CustomEvent<string>) => {
            this._protocolId = it.detail
        };

        this.addEventListener('set-access-token', this.accessTokenHandler);
        this.addEventListener('set-protocol-id', this.protocolIdHandler);
    }

    disconnectedCallback() {
        if (this.accessTokenHandler) {
            this.removeEventListener('set-access-token', this.accessTokenHandler);
            this.accessTokenHandler = null;
        }
        if (this.protocolIdHandler) {
            this.removeEventListener('set-protocol-id', this.protocolIdHandler);
            this.protocolIdHandler = null;
        }
    }

    private render(step: Step, protocolId?: string) {
        render(this.template(step, protocolId), this)
    }

    private template(step: Step, protocolId?: string) {
        return this.getStepTemplate(step, protocolId)
    };

    getStepTemplate(step: Step, protocolId?: string) {
        switch (step){
            case 0:
                return html`<greeting-step></greeting-step>`
            case 1:
                return html`<login-step></login-step>`
            case 2:
                return html`<logged-in-step .accessToken="${this._accessToken}"></logged-in-step>`
            case 3:
                return html`<create-protocol-step></create-protocol-step>`
            case 4:
                return html`<protocol-created-step></protocol-created-step>`
            case 5:
                return html`<say-hello-step .protocolId="${protocolId}"></say-hello-step>`
            case 6:
                return html`<said-hello-step></said-hello-step>`
        }
    }
}

customElements.define('steps-component', StepsComponent);

declare global {
  interface HTMLElementTagNameMap {
    'steps-component': StepsComponent;
  }
}
