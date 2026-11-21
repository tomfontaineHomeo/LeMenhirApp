"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerAction } from "./actions";
import { Button } from "@/components/ui";

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState(
    registerAction,
    undefined,
  );

  return (
    <main className="flex flex-1 items-center justify-center bg-menhir-navy px-4 py-16">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <Link
          href="/"
          className="mb-6 block text-center text-sm font-semibold tracking-widest text-menhir-navy/60 uppercase"
        >
          LeMenhirApp
        </Link>
        <h1 className="mb-1 text-center text-2xl font-bold text-menhir-navy">
          Créer mon espace élève
        </h1>
        <p className="mb-6 text-center text-sm text-menhir-navy/60">
          Suis ta progression en kitesurf à l&apos;école Le Menhir.
        </p>

        <form action={formAction} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-menhir-navy">
              Nom complet
            </label>
            <input
              name="name"
              type="text"
              required
              className="w-full rounded-lg border border-menhir-navy/20 px-3 py-2 outline-none focus:border-menhir-navy"
            />
          </div>
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
              Téléphone
            </label>
            <input
              name="phone"
              type="tel"
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
              minLength={6}
              autoComplete="new-password"
              className="w-full rounded-lg border border-menhir-navy/20 px-3 py-2 outline-none focus:border-menhir-navy"
            />
          </div>

          {state?.error && (
            <p className="text-sm font-medium text-red-600">{state.error}</p>
          )}

          <Button type="submit" disabled={pending} className="w-full">
            {pending ? "Création..." : "Créer mon compte"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-menhir-navy/70">
          Déjà un compte ?{" "}
          <Link href="/login" className="font-semibold text-menhir-navy underline">
            Se connecter
          </Link>
        </p>
      </div>
    </main>
  );
}
