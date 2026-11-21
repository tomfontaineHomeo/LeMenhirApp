import { redirect } from "next/navigation";
import Image from "next/image";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card, LevelBadge } from "@/components/ui";

const LEVEL_ORDER = [
  "DECOUVERTE",
  "INITIATION",
  "NAVIGATION_SURVEILLEE",
  "AUTONOME",
  "PERFECTIONNEMENT",
];

const DISCIPLINE_LABELS: Record<string, string> = {
  KITESURF: "Kitesurf",
  KITEFOIL: "Kitefoil",
  WING_FOIL: "Wing foil",
  STERNBOARD: "Sternboard",
  SUP: "Paddle",
  SIMULATEUR: "Simulateur",
};

export default async function EspacePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const profile = await prisma.studentProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      user: true,
      lessons: {
        orderBy: { date: "desc" },
        take: 8,
        include: { instructor: true },
      },
      photos: { orderBy: { createdAt: "desc" }, take: 6 },
      packs: { orderBy: { purchasedAt: "desc" } },
    },
  });

  if (!profile) {
    return (
      <p className="text-menhir-navy">
        Ton profil élève est introuvable. Contacte un moniteur.
      </p>
    );
  }

  const levelIndex = LEVEL_ORDER.indexOf(profile.level);
  const profilePhoto = profile.photos.find((p) => p.isProfilePhoto);
  const totalHoursPurchased = profile.packs.reduce(
    (sum, p) => sum + p.hoursPurchased,
    0,
  );

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="flex flex-wrap items-center gap-6">
        <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-menhir-yellow bg-menhir-paleblue">
          {profilePhoto ? (
            <Image
              src={profilePhoto.url}
              alt={profile.user.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-menhir-navy">
              {profile.user.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-menhir-navy">
            {profile.user.name}
          </h1>
          <div className="mt-2">
            <LevelBadge level={profile.level} />
          </div>
        </div>
      </div>

      <Card className="p-6">
        <h2 className="mb-4 font-semibold text-menhir-navy">Progression</h2>
        <div className="flex items-center justify-between">
          {LEVEL_ORDER.map((lvl, i) => (
            <div key={lvl} className="flex flex-1 items-center">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  i <= levelIndex
                    ? "bg-menhir-navy text-menhir-yellow"
                    : "bg-menhir-paleblue text-menhir-navy/50"
                }`}
              >
                {i + 1}
              </div>
              {i < LEVEL_ORDER.length - 1 && (
                <div
                  className={`h-1 flex-1 ${
                    i < levelIndex ? "bg-menhir-navy" : "bg-menhir-paleblue"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-5 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-sm text-menhir-navy/60">Heures restantes</p>
          <p className="mt-1 text-3xl font-bold text-menhir-navy">
            {profile.hoursRemaining}h
          </p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-menhir-navy/60">Heures achetées</p>
          <p className="mt-1 text-3xl font-bold text-menhir-navy">
            {totalHoursPurchased}h
          </p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-menhir-navy/60">Cours réalisés</p>
          <p className="mt-1 text-3xl font-bold text-menhir-navy">
            {profile.lessons.length}
          </p>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="mb-4 font-semibold text-menhir-navy">
          Historique des cours
        </h2>
        {profile.lessons.length === 0 ? (
          <p className="text-sm text-menhir-navy/60">
            Pas encore de cours enregistré. À bientôt sur le spot !
          </p>
        ) : (
          <ul className="divide-y divide-menhir-navy/10">
            {profile.lessons.map((lesson) => (
              <li key={lesson.id} className="flex flex-wrap items-start justify-between gap-2 py-3">
                <div>
                  <p className="font-medium text-menhir-navy">
                    {DISCIPLINE_LABELS[lesson.discipline]} ·{" "}
                    {new Date(lesson.date).toLocaleDateString("fr-FR")}
                  </p>
                  {lesson.notes && (
                    <p className="mt-1 text-sm text-menhir-navy/70">
                      {lesson.notes}
                    </p>
                  )}
                  {lesson.instructor && (
                    <p className="mt-1 text-xs text-menhir-navy/50">
                      Moniteur : {lesson.instructor.name}
                    </p>
                  )}
                </div>
                <span className="text-sm font-medium text-menhir-navy/60">
                  {lesson.durationHours}h
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card className="p-6">
        <h2 className="mb-4 font-semibold text-menhir-navy">
          Dernières photos de session
        </h2>
        {profile.photos.length === 0 ? (
          <p className="text-sm text-menhir-navy/60">
            Aucune photo pour le moment.
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            {profile.photos.map((photo) => (
              <div
                key={photo.id}
                className="relative aspect-square overflow-hidden rounded-xl bg-menhir-paleblue"
              >
                <Image
                  src={photo.url}
                  alt={photo.caption ?? "Photo de session"}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
