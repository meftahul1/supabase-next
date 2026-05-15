"use client";

import { Suspense, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";



const OutlookIcon = () => (
  <svg
    aria-hidden="true"
    focusable="false"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className="size-5"
  >
    <path fill="#f25022" d="M1 1h10v10H1z" />
    <path fill="#7fba00" d="M13 1h10v10H13z" />
    <path fill="#00a4ef" d="M1 13h10v10H1z" />
    <path fill="#ffb900" d="M13 13h10v10H13z" />
  </svg>
);

const GoogleIcon = () => (
  <svg
    aria-hidden="true"
    focusable="false"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className="size-5"
  >
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

function LoginContent() {
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);
  const [isOutlookLoading, setIsOutlookLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();
  const searchParams = useSearchParams();
  const next = searchParams.get("next");

  const loginWithGoogle = async () => {
    setIsGoogleLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${
            next ? encodeURIComponent(next) : "/protected"
          }`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      setError(error.message || "Error logging in with Google.");
      setIsGoogleLoading(false);
    }
  };

  const loginWithOutlook = async () => {
    setIsOutlookLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "azure",
        options: {
          scopes: "email openid profile",
          redirectTo: `${window.location.origin}/auth/callback?next=${next || "/protected"}`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      setError(error.message || "Error logging in with Outlook.");
      setIsOutlookLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 mt-6">
      {error && <p className="text-sm text-red-500 text-center">{error}</p>}
      <Button
        variant="outline"
        type="button"
        disabled={isGoogleLoading || isOutlookLoading}
        onClick={loginWithGoogle}
        className="w-full flex items-center justify-center gap-2"
      >
        <GoogleIcon />
        {isGoogleLoading ? "Connecting to Google..." : "Login with Google"}
      </Button>
      <Button
        variant="outline"
        type="button"
        disabled={isGoogleLoading || isOutlookLoading}
        onClick={loginWithOutlook}
        className="w-full flex items-center justify-center gap-2"
      >
        <OutlookIcon />
        {isOutlookLoading ? "Connecting to Outlook..." : "Login with Outlook"}
      </Button>
    </div>
  );
}

export function GoogleProvider() {
  return (
    <Suspense fallback={<div className="mt-6 flex justify-center text-sm">Loading providers...</div>}>
      <LoginContent />
    </Suspense>
  );
}
