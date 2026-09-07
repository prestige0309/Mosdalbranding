import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// TEMPORARY DEBUG: surface any otherwise-invisible crash as an on-screen
// alert so it's visible on a phone with no dev tools attached.
// Safe to delete once the domain issue is fixed.
window.addEventListener("error", (e) => {
  alert(`DEBUG window.onerror: ${e.message}`);
});
window.addEventListener("unhandledrejection", (e) => {
  const reason = e.reason instanceof Error ? e.reason.message : JSON.stringify(e.reason);
  alert(`DEBUG unhandledrejection: ${reason}`);
});

createRoot(document.getElementById("root")!).render(<App />);
