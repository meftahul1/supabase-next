import { Button } from "./ui/button";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { AuthButton } from "./auth-button";

export async function Hero() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="flex flex-col gap-16 items-center">
      
      <h1 className="sr-only">Supabase and Next.js Starter Template</h1>
      <p className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center">
        Dashboard App with NextJS and Supabase
      </p>
      
      {user ? (
        <div className="flex gap-2 mt-4">
          <Button asChild size="lg" variant="default">
            <Link href="/protected">Go to Dashboard</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-4">
          
            <AuthButton />
        </div>
      )}
    </div>
  );
}
