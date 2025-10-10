import Keycloak from "keycloak-js";

declare global {
  // Singleton-Instanz & Init-Promise auf globalThis speichern
  var __keycloak_instance__: Keycloak | undefined;
  var __keycloak_init_promise__: Promise<boolean> | undefined;
}

const keycloak =
  globalThis.__keycloak_instance__ ??
  new Keycloak({
    url: "http://localhost:8081",
    realm: "hr-app-new",
    clientId: "react-frontend",
  });

globalThis.__keycloak_instance__ = keycloak;

export default keycloak;

/**
 * Initialisiert Keycloak einmalig. Liefert das Init-Promise (true/false).
 * Speichert das Promise sofort auf globalThis, damit weitere Aufrufer warten können.
 */
export function initKeycloak(): Promise<boolean> {
  if (globalThis.__keycloak_init_promise__) {
    return globalThis.__keycloak_init_promise__;
  }

  // Promise sofort setzen, damit kein zweiter Aufruf init() startet
  globalThis.__keycloak_init_promise__ = (async () => {
    try {
      const authenticated = await keycloak.init({
        onLoad: "login-required",
        checkLoginIframe: false,
        redirectUri: window.location.href,
      });
      if (!authenticated) {
        // login() kann hier optional aufgerufen werden
        await keycloak.login();
      }
      return true;
    } catch (err) {
      console.error("Keycloak init failed:", err);
      return false;
    }
  })();

  return globalThis.__keycloak_init_promise__;
}
