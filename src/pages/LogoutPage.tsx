// src/pages/LogoutPage.tsx
import { useEffect } from "react";
import keycloak from "../keycloak/keycloak";

const LogoutPage = () => {
  useEffect(() => {
    keycloak.logout({ redirectUri: window.location.origin });
  }, []);

  return <p>Logging out...</p>;
};

export default LogoutPage;
