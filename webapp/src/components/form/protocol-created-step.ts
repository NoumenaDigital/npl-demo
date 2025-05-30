import { Step, type StepType } from "../../types";

export class ProtocolCreatedStep {
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
        const template = document.getElementById('createdProtocolTemplate') as HTMLTemplateElement;
        if (template) {
            const content = template.content.cloneNode(true) as DocumentFragment;
            container.appendChild(content);

            // Set up event listener for the logged in button
            this.setupCreateProtocolButtonEventListeners();
        }
    }

    setupCreateProtocolButtonEventListeners() {
        const createProtocolButton = document.getElementById('createProtocolButton');
        if (createProtocolButton) {
            createProtocolButton.addEventListener('click', () => {
                this.clearResponseContainer();
                this.setStepAndRender(Step.SAY_HELLO);
            });
        }
    }
}