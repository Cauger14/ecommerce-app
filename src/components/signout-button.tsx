"use client";
import { authClient } from "~/server/better-auth/client";
import { useRouter } from "next/navigation";

export function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <button
      onClick={handleSignOut}
      className="rounded-lg bg-gray-500 px-3 py-1.5 text-sm text-white hover:bg-gray-300"
    >
      Déconnexion
    </button>
    
  );
}
