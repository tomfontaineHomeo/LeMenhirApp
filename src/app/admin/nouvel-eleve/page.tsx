"use client";

import { useActionState } from "react";
import { createStudentAction } from "./actions";
import { Button, Card } from "@/components/ui";

export default function NouvelElevePage() {
  const [state, formAction, pending] = useActionState(
    createStudentAction,
    undefined,
  );

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="text-2xl font-bold text-menhir-navy">
        Inscrire un nouvel élève
      </h1>
      <Card className="p-6">
        <form action={formAction} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-menhir-navy">
              Nom complet
            </label>
            <input
              name="name"
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
              Mot de passe provisoire
            </label>
            <input
              name="password"
              type="text"
              required
              minLength={6}
              placeholder="À transmettre à l'élève"
              className="w-full rounded-lg border border-menhir-navy/20 px-3 py-2 outline-none focus:border-menhir-navy"
            />
          </div>

          {state?.error && (
            <p className="text-sm font-medium text-red-600">{state.error}</p>
          )}

          <Button type="submit" disabled={pending} className="w-full">
            {pending ? "Création..." : "Créer la fiche élève"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
