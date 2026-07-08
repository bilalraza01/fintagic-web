import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// Self-hosted variable fonts — one woff2 per family covers every weight.
// Bundled by Vite as same-origin assets, so they're available at first paint
// (no Google Fonts roundtrip, no late swap = no reload resize).
import "@fontsource-variable/urbanist";
import "@fontsource-variable/inter";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
