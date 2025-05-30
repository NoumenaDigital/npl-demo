import { Step, type StepType } from "../../types";

export class SaidHelloStep {
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
        const template = document.getElementById('saidHelloTemplate') as HTMLTemplateElement;
        if (template) {
            const content = template.content.cloneNode(true) as DocumentFragment;
            container.appendChild(content);

            // Add event listener to the "Again!" button after it's added to the DOM
            this.setupAgainButtonEventListeners();
        }
    }

    setupAgainButtonEventListeners() {
        setTimeout(() => {
            const startAgainButton = document.getElementById('startAgainButton');
            if (startAgainButton) {
                startAgainButton.addEventListener('click', () => {
                    // Reset app state to initial step
                    this.clearResponseContainer();
                    this.setStepAndRender(Step.GREETING);
                });
            }
        }, 0);
    }
}