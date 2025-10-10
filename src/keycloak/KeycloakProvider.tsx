import { createContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import keycloak, { initKeycloak } from "./keycloak";
import Loader from "@/components/Loader";

export const KeycloakContext = createContext({
  keycloak,
  initialized: false,
});

export const KeycloakProvider = ({ children }: { children: ReactNode }) => {
  const [initialized, setInitializedState] = useState(false);

  useEffect(() => {
    let mounted = true;
    initKeycloak().then(() => {
      if (mounted) setInitializedState(true);
    });
    return () => {
      mounted = false;
    };
  }, []);

  if (!initialized)
    return <Loader fullScreen loading={true} size={56} message="Authentifizierung wird initialisiert…" />;

  return (
    <KeycloakContext.Provider value={{ keycloak, initialized }}>
      {children}
    </KeycloakContext.Provider>
  );
};
