import keycloak, { initKeycloak } from "@/keycloak/keycloak";

export async function authFetch(url: string, options: RequestInit = {}) {
  // Sicherstellen, dass Keycloak initialisiert wurde (oder Init zumindest gestartet ist)
  await initKeycloak();

  // optional: sicherstellen, dass Token vorhanden ist / frisch ist
  try {
    await keycloak.updateToken(30); // erneuert, falls <30s Restlaufzeit
  } catch (err) {
    console.warn("updateToken failed", err);
  }

  return fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${keycloak.token}`,
    },
  });
}
