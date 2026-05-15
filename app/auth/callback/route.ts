import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  
  // if "next" is in param, use it as the redirect URL
  // this is what we send in google-provider.tsx
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    // Exchange the code for a session on the server
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // The session is now set as a cookie. Redirect the user to the final destination.
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // If there's an error or no code, redirect to an error page
  return NextResponse.redirect(`${origin}/auth/error`);
}

