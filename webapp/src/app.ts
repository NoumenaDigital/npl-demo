import './style.css';
import './components/steps.ts';
import './components/response-display.ts';
import './components/code-preview.ts';
import {html, render} from 'lit-html';
import {type Step, Steps} from './types.ts';
import type {ResponseData} from "./components/response-display.ts";
import { Analytics } from './analytics.ts';

class App extends HTMLElement {
    private currentStep: Step = Steps.GREETING
    private responseData: ResponseData | undefined
    private nextStepHandler: ((event: Event) => void) | null = null;
    private previousStepHandler: ((event: Event) => void) | null = null;
    private showResponseHandler: ((e: CustomEvent<ResponseData>) => void) | null = null;

    connectedCallback() {
        render(this.template(this.currentStep, this.responseData), this)
        this.setupEventListeners();
        Analytics.trackStepView(this.currentStep);
    }

    disconnectedCallback() {
        this.removeEventListeners();
    }

    private setupEventListeners() {
        this.nextStepHandler = this.handleNextStep.bind(this);
        this.previousStepHandler = this.handlePreviousStep.bind(this);
        this.showResponseHandler = (e: CustomEvent<ResponseData>) => {
            this.responseData = e.detail;
            this.render(this.currentStep, this.responseData);
        };

        this.addEventListener('next-step', this.nextStepHandler);
        this.addEventListener('previous-step', this.previousStepHandler);
        this.addEventListener('show-response', this.showResponseHandler);
    }

    private removeEventListeners() {
        if (this.nextStepHandler) {
            this.removeEventListener('next-step', this.nextStepHandler);
            this.nextStepHandler = null;
        }

        if (this.previousStepHandler) {
            this.removeEventListener('previous-step', this.previousStepHandler);
            this.previousStepHandler = null;
        }

        if (this.showResponseHandler) {
            this.removeEventListener('show-response', this.showResponseHandler);
            this.showResponseHandler = null;
        }
    }


    private handleNextStep() {
        const previousStep = this.currentStep;
        const nextStep = this.currentStep === Steps.SAID_HELLO
            ? Steps.GREETING
            : this.currentStep + 1 as Step;
        
        if (this.currentStep === Steps.SAID_HELLO) {
            Analytics.trackDemoRestart(previousStep);
        } else {
            Analytics.trackNextClick(previousStep, nextStep);
        }
        
        this.currentStep = nextStep;
        Analytics.trackStepView(this.currentStep);
        this.render(this.currentStep, this.responseData)
    }

    private handlePreviousStep() {
        if (this.currentStep > Steps.GREETING) {
            const previousStep = this.currentStep;
            const nextStep = this.currentStep - 1 as Step;
            
            Analytics.trackPreviousClick(previousStep, nextStep);
            this.currentStep = nextStep;
            Analytics.trackStepView(this.currentStep);
            this.render(this.currentStep, this.responseData);
        }
    }

    private render(step: Step, responseData?: ResponseData) {
        render(this.template(step, responseData), this);
    }

    private template(step: Step, responseData?: ResponseData) {
        return html`
            <div class="app-layout">
                <code-preview-component></code-preview-component>
                <steps-component .step=${step}>
                </steps-component>
                ${responseData && html`<response-display .responseData="${responseData}"></response-display>`}
            </div>
        `;
    }
}

customElements.define('noumena-app', App);

declare global {
    interface HTMLElementTagNameMap {
        'noumena-app': App;
    }
}
