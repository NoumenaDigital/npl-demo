import {html, render} from "lit-html";

interface ApiRequestInfo {
    method: string;
    endpoint: string;
    statusCode: number;
}

export interface ResponseData {
    type: string;
    title?: string;
    message?: string;
    description?: string;
    requestInfo?: ApiRequestInfo;
    body?: any;
    decodedToken?: any;
}

export class ResponseDisplay extends HTMLElement {
    private _responseData?: ResponseData | undefined

    set responseData(value: ResponseData | undefined) {
        this.render(value)
    }

    connectedCallback () {
        this.render(this._responseData)
    }

    public render(responseData?: ResponseData) {
        render(this.template(responseData), this);
    }

    private renderLoadingContent(responseData: ResponseData) {
        return html`
            <div class="loading-message">
                <h3>${responseData.message}</h3>
                <p>${responseData.description || 'Please wait...'}</p>
            </div>
        `;
    }

    private renderErrorContent() {
        return html`
            <div class="error-message">
                <h3>${this._responseData?.title || 'Error'}</h3>
                <p>${this._responseData?.message || 'An error occurred.'}</p>
            </div>
        `;
    }

    private renderApiResponseContent(responseData: ResponseData) {
        const { requestInfo, body } = responseData || {};

        if (!requestInfo || !body) {
            return html`<div>No response data available</div>`;
        }

        const { method, endpoint, statusCode } = requestInfo;

        return html`
            <div class="request-details">
                <span class="method">${method}</span>
                <span class="endpoint">${endpoint}</span>
                <span class="status-code" data-status="${statusCode}">${statusCode}</span>
            </div>
            <pre class="json-output" id="json-output">${JSON.stringify(body, null, 2)}</pre>
        `;
    }

    template(responseData?: ResponseData) {
        let content;

        if (!responseData) {
            content = '';
        } else {
            switch (responseData.type) {
                case 'loading':
                    content = this.renderLoadingContent(responseData);
                    break;
                case 'error':
                    content = this.renderErrorContent();
                    break;
                case 'api-response':
                    content = this.renderApiResponseContent(responseData);
                    break;
                default:
                    content = html`<div>Unknown response type</div>`;
            }
        }

        return html`
            <h2 class="response-heading">Server Response</h2>
            ${content}
        `;
    }
}

customElements.define('response-display', ResponseDisplay);

declare global {
    interface HTMLElementTagNameMap {
        'response-display': ResponseDisplay;
    }
}
