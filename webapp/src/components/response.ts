export class ResponseComponent {
    container: HTMLElement | null;

    constructor() {
        this.container = document.getElementById('responseContainer');;
    }

    render(content: HTMLElement) {
        if (this.container) {
            // Clear any existing content
            this.clear();

            // Add the heading
            const heading = document.createElement('h2');
            heading.className = 'response-heading';
            heading.textContent = 'Server Response';
            this.container.appendChild(heading);

            // Add the new content
            this.container.appendChild(content);
        }
    }

    clear() {
        if (this.container) {
            this.container.innerHTML = '';
        }
    }
};