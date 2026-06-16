/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_KEY: string;
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_REDIRECT_URL: string;
  readonly VITE_SECRET_KEY: string;
  readonly VITE_WS_AUTH_TOKEN: string;
  readonly VITE_WSS_URL: string;
  readonly VITE_FEEDBACK_URL: string;
  readonly VITE_FEEDBACK_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
