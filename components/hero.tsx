import { Button } from "./ui/button";
import Link from "next/link";


export function Hero() {
  return (
    <div className="flex flex-col gap-16 items-center">
      
      <h1 className="sr-only">Supabase and Next.js Starter Template</h1>
      <p className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center">
        Dashboard App with NextJS and Supabase
      </p>
      {/* <AuthButton /> */}
      <div className="flex gap-2">
      {/* <Button asChild size="sm" variant={"outline"}>
        <Link href="/auth/login">Sign In</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/auth/sign-up">Sign Up</Link>
      </Button> */}
    </div>
    </div>
  );
}
