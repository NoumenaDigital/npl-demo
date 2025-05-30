import { jwtDecode } from "jwt-decode";
import { Step, type StepType } from "../../types";

export class LoggedInStep {
    setStepAndRender: (step: StepType) => void;
    clearResponseContainer: () => void;

    constructor(
        setStepAndRender: (step: StepType) => void,
        clearResponseContainer: () => void
    ) {
        this.setStepAndRender = setStepAndRender;
        this.clearResponseContainer = clearResponseContainer;
    }

    render(container: HTMLElement, accessToken: string | null) {
        const template = document.getElementById('loggedInTemplate') as HTMLTemplateElement;
        if (template) {
            const content = template.content.cloneNode(true) as DocumentFragment;
            container.appendChild(content);

            // Display the decoded token information
            const tokenInfoContainer = document.getElementById('logged-in-token-info');
            if (tokenInfoContainer && accessToken) {
                const decodedToken = jwtDecode(accessToken);
                const tokenInfo = document.createElement('pre');
                tokenInfo.className = 'token-info';
                tokenInfo.textContent = JSON.stringify(decodedToken, null, 2);
                tokenInfoContainer.appendChild(tokenInfo);
            }

            // Set up event listener for the logged in button
            this.setupLoggedInButtonEventListeners();
        }
    }

    setupLoggedInButtonEventListeners() {
        const loggedInButton = document.getElementById('loggedInButton');
        if (loggedInButton) {
            loggedInButton.addEventListener('click', () => {
                this.clearResponseContainer();
                this.setStepAndRender(Step.CREATE_PROTOCOL);
            });
        }
    }
}