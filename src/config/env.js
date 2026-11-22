// One build serves every environment: the API is chosen from the domain the panel is opened on,
// so there is no separate staging build. Add a host here when a new panel domain is created.
const API_BY_HOST = {
  "math-community-panel.vasundharaapps.com": "https://mathscanners.in/",
  "staging-math-community-panel.vasundharaapps.com": "https://staging-api.mathscanners.in/",
};

const resolveApiUrl = () => {
  // Local `npm run dev` keeps using VITE_API_URL from .env.
  if (import.meta.env.DEV) return import.meta.env.VITE_API_URL ?? "";
  return API_BY_HOST[window.location.hostname] ?? import.meta.env.VITE_API_URL ?? "";
};

export const env = Object.freeze({
  apiUrl: resolveApiUrl(),
  isDev: import.meta.env.DEV,
});
