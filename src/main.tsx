// ============================================================================
// Title: Application Entry Point | نقطة دخول التطبيق
// Description (EN): Mounts the React app, wraps it with the LanguageProvider so the whole UI can switch between English and Arabic, and applies global styles.
// الوصف (AR): يُحمّل تطبيق React، يلفه بمزوّد اللغة لتبديل الواجهة بين الإنجليزية والعربية، ويطبق الأنماط العامة.
// ============================================================================

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { LanguageProvider } from "./i18n";
import "./index.css";

/* Title: Root Render | العرض الجذري
   Description (EN): Renders the app inside the #root element, wrapped by the language provider.
   الوصف (AR): يعرض التطبيق داخل عنصر #root، ملفوفًا بمزوّد اللغة.
*/
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>
);
