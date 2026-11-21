"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction } from "./actions";
import { Button } from "@/components/ui";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, undefined);

  return (
    <main className="flex flex-1 items-center justify-center bg-menhir-navy px-4 py-16">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <Link
          href="/"
          className="mb-6 block text-center text-sm font-semibold tracking-widest text-menhir-navy/60 uppercase"
        >
          LeMenhirApp
        </Link>
        <h1 className="mb-6 text-center text-2xl font-bold text-menhir-navy">
          Connexion
        </h1>

        <form action={formAction} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-menhir-navy">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full rounded-lg border border-menhir-navy/20 px-3 py-2 outline-none focus:border-menhir-navy"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-menhir-navy">
              Mot de passe
            </label>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-lg border border-menhir-navy/20 px-3 py-2 outline-none focus:border-menhir-navy"
            />
          </div>

          {state?.error && (
            <p className="text-sm font-medium text-red-600">{state.error}</p>
          )}

          <Button type="submit" disabled={pending} className="w-full">
            {pending ? "Connexion..." : "Se connecter"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-menhir-navy/70">
          Pas encore de compte élève ?{" "}
          <Link
            href="/register"
            className="font-semibold text-menhir-navy underline"
          >
            Créer mon compte
          </Link>
        </p>
      </div>
    </main>
  );
}
