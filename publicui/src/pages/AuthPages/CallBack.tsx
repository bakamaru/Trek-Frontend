import { getUser, oidc } from "../../utils/OIDCAuth";
import { useEffect } from "react";
import AuthHelper from "../../utils/AuthHelper";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function SignInCallback() {
    useEffect(() => {
        async function handleCallback() {
            try {
                // Process the OIDC callback and clean up the URL
                if (window.location.pathname === "/auth/callback" && window.location.search.includes("code=")) {
                    await oidc.signinRedirectCallback();
                    const u = await getUser();
                    if (u?.access_token) {
                        AuthHelper.SetNewLogin(u.access_token);
                    }
                    // Add a small delay for token persistence/state sync
                    await new Promise(resolve => setTimeout(resolve, 2000));
                }
            } catch (error) {
                console.error("OIDC Callback Error:", error);
            } finally {
                // Always navigate back to home
                window.location.replace("/");
            }
        }
        handleCallback();
    }, []);

    return (
        <>
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <LoadingSpinner />
                <p className="mt-4 text-gray-600 dark:text-gray-400 animate-pulse">
                    Authenticating, please wait...
                </p>
            </div>
        </>
    );
}

