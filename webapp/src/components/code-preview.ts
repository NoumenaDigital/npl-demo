import { html, render } from 'lit-html';

export class CodePreviewComponent extends HTMLElement {
  private copyBtnClickHandler: (() => void) | null = null;

  connectedCallback() {
    render(this.template(), this);
    this.setupEventListeners();
  }

  disconnectedCallback() {
    this.removeEventListeners();
  }

  template() {
    return html`
      <div class="code-header">
        <div class="code-title">demo/HelloWorld.npl</div>
        <button class="code-copy-btn">Copy</button>
      </div>

      <div class="code-content">
        <div class="code-line"><span class="line-number">1</span> <span class="line-code"><span class="keyword">package</span> demo;</span></div>
        <div class="code-line"><span class="line-number">2</span> <span class="line-code"></span></div>
        <div class="code-line"><span class="line-number">3</span> <span class="line-code"><span class="api-annotation">@api</span></span></div>
        <div class="code-line"><span class="line-number">4</span> <span class="line-code"><span class="keyword">protocol</span>[greeter] HelloWorld() {</span></div>
        <div class="code-line"><span class="line-number">5</span> <span class="line-code"></span></div>
        <div class="code-line"><span class="line-number">6</span> <span class="line-code">&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">initial</span> <span class="keyword">state</span> greeting;</span></div>
        <div class="code-line"><span class="line-number">7</span> <span class="line-code">&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">final</span> <span class="keyword">state</span> greeted;</span></div>
        <div class="code-line"><span class="line-number">8</span> <span class="line-code"></span></div>
        <div class="code-line"><span class="line-number">9</span> <span class="line-code">&nbsp;&nbsp;&nbsp;&nbsp;<span class="api-annotation">@api</span></span></div>
        <div class="code-line"><span class="line-number">10</span> <span class="line-code">&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">permission</span>[greeter] <span class="function">sayHello</span>() <span class="keyword">returns</span> Text | greeting {</span></div>
        <div class="code-line"><span class="line-number">11</span> <span class="line-code">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">become</span> greeted;</span></div>
        <div class="code-line"><span class="line-number">12</span> <span class="line-code">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">return</span> <span class="string">"Hello "</span> + <span class="function">getUsername</span>(greeter) + <span class="string">"!"</span>;</span></div>
        <div class="code-line"><span class="line-number">13</span> <span class="line-code">&nbsp;&nbsp;&nbsp;&nbsp;};</span></div>
        <div class="code-line"><span class="line-number">14</span> <span class="line-code">};</span></div>
        <div class="code-line"><span class="line-number">15</span> <span class="line-code"></span></div>
        <div class="code-line"><span class="line-number">16</span> <span class="line-code"><span class="keyword">function</span> <span class="function">getUsername</span>(party: Party) <span class="keyword">returns</span> Text -></span></div>
        <div class="code-line"><span class="line-number">17</span> <span class="line-code">&nbsp;&nbsp;&nbsp;&nbsp;party.<span class="function">claims</span>()</span></div>
        <div class="code-line"><span class="line-number">18</span> <span class="line-code">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;.<span class="function">getOrNone</span>(<span class="string">"preferred_username"</span>)</span></div>
        <div class="code-line"><span class="line-number">19</span> <span class="line-code">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;.<span class="function">getOrFail</span>()</span></div>
        <div class="code-line"><span class="line-number">20</span> <span class="line-code">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;.<span class="function">toList</span>()</span></div>
        <div class="code-line"><span class="line-number">21</span> <span class="line-code">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;.<span class="function">get</span>(<span class="number">0</span>);</span></div>
        <div class="code-line"><span class="line-number">22</span> <span class="line-code"></span></div>
      </div>
    `;
  }

  copyCode(): void {
    const codeLines = document.querySelectorAll('.line-code');
    let codeText = '';

    codeLines.forEach(line => {
      codeText += line.textContent + '\n';
    });
    codeText += '\n';

    navigator.clipboard.writeText(codeText).then(() => {
      const copyBtn = document.querySelector('.code-copy-btn');
      if (copyBtn) {
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
          copyBtn.textContent = 'Copy';
        }, 2000);
      }
    });
  }

  setupEventListeners(): void {
    const copyBtn = this.querySelector('.code-copy-btn');
    if (copyBtn) {
      this.copyBtnClickHandler = () => this.copyCode();
      copyBtn.addEventListener('click', this.copyBtnClickHandler);
    }
  }

  removeEventListeners(): void {
    const copyBtn = this.querySelector('.code-copy-btn');
    if (copyBtn && this.copyBtnClickHandler) {
      copyBtn.removeEventListener('click', this.copyBtnClickHandler);
      this.copyBtnClickHandler = null;
    }
  }}

customElements.define('code-preview-component', CodePreviewComponent);

declare global {
  interface HTMLElementTagNameMap {
    'code-preview-component': CodePreviewComponent;
  }
}
