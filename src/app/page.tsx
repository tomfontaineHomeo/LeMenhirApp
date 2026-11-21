import { LinkButton, Card } from "@/components/ui";
import { LogoWordmark, MenhirMark } from "@/components/logo";

const levels = [
  { label: "Découverte", desc: "Théorie, sécurité, premiers gestes" },
  { label: "Initiation", desc: "École de pilotage, premières glisses" },
  { label: "Navigation surveillée", desc: "Autonomie encadrée sur l'eau" },
  { label: "Autonome", desc: "Navigue seul en toute sécurité" },
  { label: "Perfectionnement", desc: "Figures, foil, rides avancées" },
];

const features = [
  {
    title: "Suivi de progression",
    desc: "Chaque élève suit son niveau, ses heures restantes et l'historique de ses cours.",
  },
  {
    title: "Fiches coach détaillées",
    desc: "Les moniteurs notent les conditions, les points travaillés et les photos de chaque séance.",
  },
  {
    title: "Une vue d'ensemble pour l'école",
    desc: "Quentin et Tom pilotent tous les élèves, tous les cours, depuis un seul tableau de bord.",
  },
  {
    title: "Bientôt : communauté & messagerie",
    desc: "Rejoindre la communauté LeMenhirApp, échanger avec les moniteurs et les autres riders.",
  },
];

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <header className="flex items-center justify-between px-6 py-5 sm:px-10">
        <LogoWordmark className="text-lg text-menhir-navy" />
        <nav className="flex items-center gap-3">
          <LinkButton href="/login" variant="ghost">
            Connexion
          </LinkButton>
          <LinkButton href="/register" variant="primary">
            Créer mon compte
          </LinkButton>
        </nav>
      </header>

      <section className="relative overflow-hidden bg-menhir-navy px-6 py-20 text-white sm:px-10">
        <MenhirMark className="pointer-events-none absolute -right-10 -top-10 h-64 w-64 text-white/5" />
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-menhir-yellow">
            Le Menhir Normandie Kite — Cabourg
          </p>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
            L&apos;espace élèves &amp; moniteurs de ton école de kitesurf
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-white/80">
            Suis ta progression, tes cours, tes photos de session — et pour
            l&apos;école, pilote tous les élèves depuis un seul endroit.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <LinkButton href="/register" variant="primary" className="px-6 py-3 text-base">
              Je suis élève, je m&apos;inscris
            </LinkButton>
            <LinkButton href="/login" variant="secondary" className="px-6 py-3 text-base">
              Espace moniteurs
            </LinkButton>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-2xl font-bold text-menhir-navy">
            Ce que propose LeMenhirApp
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {features.map((f) => (
              <Card key={f.title} className="p-6">
                <h3 className="font-semibold text-menhir-navy">{f.title}</h3>
                <p className="mt-2 text-sm text-menhir-navy/70">{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-menhir-paleblue px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-2xl font-bold text-menhir-navy">
            Le parcours de progression
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-sm text-menhir-navy/70">
            Les mêmes paliers que sur nos stages, du premier cours à
            l&apos;autonomie complète.
          </p>
          <ol className="mt-10 grid gap-4 sm:grid-cols-5">
            {levels.map((lvl, i) => (
              <li
                key={lvl.label}
                className="rounded-2xl bg-white p-4 text-center shadow-sm"
              >
                <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-menhir-navy text-sm font-bold text-menhir-yellow">
                  {i + 1}
                </div>
                <p className="text-sm font-semibold text-menhir-navy">
                  {lvl.label}
                </p>
                <p className="mt-1 text-xs text-menhir-navy/60">{lvl.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <footer className="mt-auto flex flex-col items-center gap-2 bg-menhir-navy px-6 py-8 text-center text-sm text-white/60 sm:px-10">
        <LogoWordmark className="text-base text-white" />
        <p>École de kitesurf Le Menhir Normandie Kite · Cabourg</p>
      </footer>
    </main>
  );
}
