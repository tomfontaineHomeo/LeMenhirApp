import { signOut } from "@/auth";

export function SignOutButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/" });
      }}
    >
      <button
        type="submit"
        className="rounded-full border border-white/30 px-4 py-1.5 text-sm text-white transition-colors hover:bg-white/10"
      >
        Déconnexion
      </button>
    </form>
  );
}
