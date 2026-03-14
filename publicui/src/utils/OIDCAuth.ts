import { UserManager, WebStorageStateStore, Log, type User } from "oidc-client-ts";

const authority = import.meta.env.VITE_IDENTITY_SERVER;
const clientId = import.meta.env.VITE_API_CLIENTID;

export const oidc = new UserManager({
    authority,
    client_id: clientId,
    redirect_uri: import.meta.env.VITE_API_REDIRECT_URI,
    post_logout_redirect_uri: import.meta.env.VITE_API_LOGOUT_REDIRECT_URI,
    response_type: "code",
    scope: "openid profile email",//api + offline_access(refresh token)
    // Use localStorage to survive refreshes
    userStore: new WebStorageStateStore({ store: window.localStorage }),
    // Helpful for dev
    automaticSilentRenew: false
});

Log.setLevel(Log.INFO);
Log.setLogger(console);

export async function signin() {
    return oidc.signinRedirect({ prompt: "consent" });
}

export async function signout() {
    return oidc.signoutRedirect();
}

export async function getUser(): Promise<User | null> {
    return oidc.getUser();
}
