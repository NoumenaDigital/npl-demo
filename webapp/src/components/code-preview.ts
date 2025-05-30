export class CodePreviewComponent {
  private responseContainer: HTMLElement | null = null;

  constructor() {
    this.responseContainer = document.getElementById('responseContainer');
  }

  init(): void {
    // Container should be empty initially
  }

  clear(): void {
    if (this.responseContainer) {
      this.responseContainer.innerHTML = '';
    }
  }

  show(content: HTMLElement): void {
    if (this.responseContainer) {
      this.responseContainer.innerHTML = '';

      const heading = document.createElement('h2');
      heading.className = 'response-heading';
      heading.textContent = 'Server Response';
      this.responseContainer.appendChild(heading);

      this.responseContainer.appendChild(content);
    }
  }

  renderAppStructure(): void {
    const appTemplate = document.getElementById('appTemplate') as HTMLTemplateElement;
    const codeTemplate = document.getElementById('codeTemplate') as HTMLTemplateElement;

    if (appTemplate && codeTemplate) {
      const appContent = appTemplate.content.cloneNode(true) as DocumentFragment;
      const codeContent = codeTemplate.content.cloneNode(true);

      const codeElement = appContent.querySelector('#codeContent');
      if (codeElement) {
        codeElement.innerHTML = '';
        codeElement.appendChild(codeContent);
      }

      const appDiv = document.querySelector<HTMLDivElement>('#app');
      if (appDiv) {
        appDiv.innerHTML = '';
        appDiv.appendChild(appContent);
      }
    }
  }
}