import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";
import { getUser, oidc, signin, signout } from "../../utils/OIDCAuth";
import type { User } from "oidc-client-ts";
import { useEffect, useMemo, useState } from "react";
import Button from "../../components/ui/button/Button";
export default function SignIn() {
  const [user, setUser] = useState<User | null>(null);
  const isCallback = useMemo(() => window.location.pathname === "/auth/callback", []);

  useEffect(() => {
    async function init() {
      if (isCallback) {
        // Process the OIDC callback and clean up the URL
        await oidc.signinRedirectCallback();
        window.location.replace("/");
        return;
      }
      const u = await getUser();
      setUser(u);
    }
    init();
  }, [isCallback]);
  return (
    <>
      <PageMeta
        title="Login || Yang One"
        description="Login to the platform"
      />
      <AuthLayout>
        <SignInForm />

        {!user && (
          <div className="flex gap-2">
            <Button onClick={() => signin()}>Sign in</Button>
          </div>
        )}

        {user && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Button onClick={() => signout()}>Sign out</Button>

            </div>

            <div className="text-sm">
              <div><span className="font-semibold">Name:</span> {user.profile?.name ?? "(none)"}</div>
              <div><span className="font-semibold">Email:</span> {user.profile?.email ?? "(none)"}</div>
              <div className="break-all"><span className="font-semibold">sub:</span> {user.profile?.sub}</div>
            </div>

            <details className="text-sm">
              <summary className="cursor-pointer select-none">Tokens</summary>
              <pre className="mt-2 p-3 bg-gray-100 rounded overflow-auto text-xs">
                {JSON.stringify({ access_token: user.access_token, id_token: user.id_token }, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </AuthLayout>
    </>
  );
}
