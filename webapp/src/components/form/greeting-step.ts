import { Step, type StepType } from "../../types";

export class GreetingStep {
    setStepAndRender: (step: StepType) => void;
    clearResponseContainer: () => void;

    constructor(
        setStepAndRender: (step: StepType) => void,
        clearResponseContainer: () => void
    ) {
        this.setStepAndRender = setStepAndRender;
        this.clearResponseContainer = clearResponseContainer;
    }

    render(container: HTMLElement) {
        const template = document.getElementById('greetingTemplate') as HTMLTemplateElement;
        if (template) {
            const content = template.content.cloneNode(true) as DocumentFragment;
            container.appendChild(content);

            // Set up event listener for the start button
            this.setupStartButtonEventListeners();
        }
    }

    setupStartButtonEventListeners() {
        const startButton = document.getElementById('startDemoButton');
        if (startButton) {
            startButton.addEventListener('click', () => {
                this.clearResponseContainer();
                this.setStepAndRender(Step.LOGIN);
            });
        }
    }
}