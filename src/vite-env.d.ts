/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Full URL of the Rails endpoint that receives Contact form submissions.
   *  Dev: http://localhost:3001/v1/fintagic/contact
   *  Prod: https://api.lumelogics.com/v1/fintagic/contact */
  readonly VITE_CONTACT_ENDPOINT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
