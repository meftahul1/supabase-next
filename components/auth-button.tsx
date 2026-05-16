import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";

export async function AuthButton() {
  const supabase = await createClient();

  // You can also use getUser() which will be slower.
  const { data } = await supabase.auth.getClaims();

  const user = data?.claims;
 




  // console.log(user);
  function getUserName(user: any){


    // console.log(user.email);
    const userEmail = user.email;

    // split string by "@" and return first part
    const userName = userEmail.split("@")[0];

    const fullName = user.user_metadata?.full_name;

    if (fullName) {
      return fullName;
    }

    return userName;

  }

  return user ? (
    <div className="flex items-center gap-4">
      Hey, {getUserName(user)}

      <LogoutButton />

    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/auth/login">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/auth/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}


