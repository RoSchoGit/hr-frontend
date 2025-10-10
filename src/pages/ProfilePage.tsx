import { useContext, useEffect, useState } from "react";
import { KeycloakContext } from "../keycloak/KeycloakProvider";

function ProfilePage() {
    const { keycloak } = useContext(KeycloakContext);
    const [profile, setProfile] = useState<any>(null);

    useEffect(() => {
        if (keycloak && keycloak.authenticated) {
            keycloak.loadUserProfile().then(p => setProfile(p));
        }
    }, [keycloak]);

    if (!profile) return <p>Lade Profile...</p>;


    return (
        <div>
            <h1>Profile</h1>
            <ul>
                <li>Username: {profile.username}</li>
                <li>Email: {profile.email}</li>
                <li>First Name: {profile.firstName}</li>
                <li>Last Name: {profile.lastName}</li>
            </ul>
        </div>
    );
}

export default ProfilePage;
