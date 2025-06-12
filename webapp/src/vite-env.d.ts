/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SERVER_URL: string;
  readonly VITE_AUTH_URL: string;
  readonly VITE_AUTH_CLIENT_ID: string;
  readonly VITE_USER_USERNAME: string;
  readonly VITE_USER_PASSWORD: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
