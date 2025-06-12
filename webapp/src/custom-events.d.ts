import { ResponseData } from "./components/response-display";

declare global {
  interface HTMLElementEventMap {
    'next-step': CustomEvent<void>;
    'previous-step': CustomEvent<void>;
    'show-response': CustomEvent<ResponseData>;
    'set-access-token': CustomEvent<string>;
    'set-protocol-id': CustomEvent<string>;
    'clear-response': CustomEvent<void>;
  }
}

export {};
