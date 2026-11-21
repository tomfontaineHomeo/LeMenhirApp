import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, LevelBadge } from "@/components/ui";
import {
  updateLevelAction,
  addLessonAction,
  addNoteAction,
  addPackAction,
  uploadPhotoAction,
} from "./actions";

const LEVELS = [
  ["DECOUVERTE", "Découverte"],
  ["INITIATION", "Initiation"],
  ["NAVIGATION_SURVEILLEE", "Navigation surveillée"],
  ["AUTONOME", "Autonome"],
  ["PERFECTIONNEMENT", "Perfectionnement"],
];

const DISCIPLINES = [
  ["KITESURF", "Kitesurf"],
  ["KITEFOIL", "Kitefoil"],
  ["WING_FOIL", "Wing foil"],
  ["STERNBOARD", "Sternboard"],
  ["SUP", "Paddle"],
  ["SIMULATEUR", "Simulateur"],
];

export default async function StudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const profile = await prisma.studentProfile.findUnique({
    where: { id },
    include: {
      user: true,
      lessons: { orderBy: { date: "desc" }, include: { instructor: true } },
      photos: { orderBy: { createdAt: "desc" } },
      packs: { orderBy: { purchasedAt: "desc" } },
      coachNotes: { orderBy: { createdAt: "desc" }, include: { author: true } },
    },
  });

  if (!profile) notFound();

  const profilePhoto = profile.photos.find((p) => p.isProfilePhoto);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-center gap-5">
        <div className="relative h-20 w-20 overflow-hidden rounded-full border-4 border-menhir-yellow bg-menhir-paleblue">
          {profilePhoto ? (
            <Image src={profilePhoto.url} alt={profile.user.name} fill className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xl font-bold text-menhir-navy">
              {profile.user.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-menhir-navy">{profile.user.name}</h1>
          <p className="text-sm text-menhir-navy/60">
            {profile.user.email} {profile.user.phone ? `· ${profile.user.phone}` : ""}
          </p>
          <div className="mt-2 flex items-center gap-3">
            <LevelBadge level={profile.level} />
            <span className="text-sm text-menhir-navy/70">
              {profile.hoursRemaining}h restantes
            </span>
          </div>
        </div>
      </div>

      <Card className="p-6">
        <h2 className="mb-3 font-semibold text-menhir-navy">Niveau</h2>
        <form action={updateLevelAction} className="flex flex-wrap items-center gap-3">
          <input type="hidden" name="studentProfileId" value={profile.id} />
          <select
            name="level"
            defaultValue={profile.level}
            className="rounded-lg border border-menhir-navy/20 px-3 py-2 text-sm"
          >
            {LEVELS.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <button className="rounded-full bg-menhir-navy px-4 py-2 text-sm font-semibold text-white hover:bg-menhir-navy-light">
            Mettre à jour
          </button>
        </form>
      </Card>

      <div className="grid gap-6 sm:grid-cols-2">
        <Card className="p-6">
          <h2 className="mb-3 font-semibold text-menhir-navy">Packs d&apos;heures</h2>
          <ul className="mb-4 space-y-2 text-sm">
            {profile.packs.map((pack) => (
              <li key={pack.id} className="flex justify-between border-b border-menhir-navy/10 pb-2">
                <span className="text-menhir-navy">{pack.name}</span>
                <span className="text-menhir-navy/60">
                  {pack.hoursPurchased}h · {new Date(pack.purchasedAt).toLocaleDateString("fr-FR")}
                </span>
              </li>
            ))}
            {profile.packs.length === 0 && (
              <p className="text-menhir-navy/50">Aucun pack enregistré.</p>
            )}
          </ul>
          <form action={addPackAction} className="space-y-2">
            <input type="hidden" name="studentProfileId" value={profile.id} />
            <input
              name="name"
              placeholder="Ex: Pack Initiation 10h"
              required
              className="w-full rounded-lg border border-menhir-navy/20 px-3 py-2 text-sm"
            />
            <input
              name="hoursPurchased"
              type="number"
              step="0.5"
              min="0"
              placeholder="Heures"
              required
              className="w-full rounded-lg border border-menhir-navy/20 px-3 py-2 text-sm"
            />
            <button className="w-full rounded-full bg-menhir-yellow px-4 py-2 text-sm font-semibold text-menhir-navy hover:bg-menhir-yellow-dark">
              Ajouter le pack
            </button>
          </form>
        </Card>

        <Card className="p-6">
          <h2 className="mb-3 font-semibold text-menhir-navy">Photo de profil / session</h2>
          <form action={uploadPhotoAction} className="space-y-2" encType="multipart/form-data">
            <input type="hidden" name="studentProfileId" value={profile.id} />
            <input
              name="photo"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              required
              className="w-full rounded-lg border border-menhir-navy/20 px-3 py-2 text-sm"
            />
            <input
              name="caption"
              placeholder="Légende (optionnel)"
              className="w-full rounded-lg border border-menhir-navy/20 px-3 py-2 text-sm"
            />
            <label className="flex items-center gap-2 text-sm text-menhir-navy">
              <input type="checkbox" name="isProfilePhoto" />
              Utiliser comme photo de profil
            </label>
            <button className="w-full rounded-full bg-menhir-navy px-4 py-2 text-sm font-semibold text-white hover:bg-menhir-navy-light">
              Envoyer la photo
            </button>
          </form>
          <div className="mt-4 grid grid-cols-4 gap-2">
            {profile.photos.slice(0, 8).map((photo) => (
              <div key={photo.id} className="relative aspect-square overflow-hidden rounded-lg bg-menhir-paleblue">
                <Image src={photo.url} alt={photo.caption ?? ""} fill className="object-cover" />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="mb-3 font-semibold text-menhir-navy">Ajouter un cours</h2>
        <form action={addLessonAction} className="grid gap-3 sm:grid-cols-2">
          <input type="hidden" name="studentProfileId" value={profile.id} />
          <div>
            <label className="mb-1 block text-xs font-medium text-menhir-navy/70">Date</label>
            <input
              name="date"
              type="date"
              defaultValue={new Date().toISOString().slice(0, 10)}
              className="w-full rounded-lg border border-menhir-navy/20 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-menhir-navy/70">Discipline</label>
            <select name="discipline" className="w-full rounded-lg border border-menhir-navy/20 px-3 py-2 text-sm">
              {DISCIPLINES.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-menhir-navy/70">Durée (h)</label>
            <input
              name="durationHours"
              type="number"
              step="0.5"
              min="0.5"
              defaultValue="1"
              required
              className="w-full rounded-lg border border-menhir-navy/20 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-menhir-navy/70">Conditions de vent</label>
            <input
              name="windConditions"
              placeholder="Ex: 20 noeuds, vent de travers"
              className="w-full rounded-lg border border-menhir-navy/20 px-3 py-2 text-sm"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-menhir-navy/70">Notes du moniteur</label>
            <textarea
              name="notes"
              rows={2}
              className="w-full rounded-lg border border-menhir-navy/20 px-3 py-2 text-sm"
            />
          </div>
          <button className="sm:col-span-2 rounded-full bg-menhir-yellow px-4 py-2 text-sm font-semibold text-menhir-navy hover:bg-menhir-yellow-dark">
            Enregistrer le cours
          </button>
        </form>

        <ul className="mt-6 divide-y divide-menhir-navy/10">
          {profile.lessons.map((lesson) => (
            <li key={lesson.id} className="flex flex-wrap items-start justify-between gap-2 py-3">
              <div>
                <p className="font-medium text-menhir-navy">
                  {new Date(lesson.date).toLocaleDateString("fr-FR")} · {lesson.discipline}
                  {lesson.instructor ? ` · ${lesson.instructor.name}` : ""}
                </p>
                {lesson.windConditions && (
                  <p className="text-xs text-menhir-navy/50">{lesson.windConditions}</p>
                )}
                {lesson.notes && <p className="mt-1 text-sm text-menhir-navy/70">{lesson.notes}</p>}
              </div>
              <span className="text-sm font-medium text-menhir-navy/60">{lesson.durationHours}h</span>
            </li>
          ))}
          {profile.lessons.length === 0 && (
            <p className="py-3 text-sm text-menhir-navy/50">Aucun cours enregistré.</p>
          )}
        </ul>
      </Card>

      <Card className="p-6">
        <h2 className="mb-3 font-semibold text-menhir-navy">Notes de coaching</h2>
        <form action={addNoteAction} className="mb-4 flex gap-2">
          <input type="hidden" name="studentProfileId" value={profile.id} />
          <textarea
            name="content"
            rows={2}
            required
            placeholder="Ajouter une note sur cet élève..."
            className="flex-1 rounded-lg border border-menhir-navy/20 px-3 py-2 text-sm"
          />
          <button className="self-end rounded-full bg-menhir-navy px-4 py-2 text-sm font-semibold text-white hover:bg-menhir-navy-light">
            Ajouter
          </button>
        </form>
        <ul className="space-y-3">
          {profile.coachNotes.map((note) => (
            <li key={note.id} className="rounded-lg bg-menhir-paleblue/40 p-3 text-sm">
              <p className="text-menhir-navy">{note.content}</p>
              <p className="mt-1 text-xs text-menhir-navy/50">
                {note.author.name} · {new Date(note.createdAt).toLocaleDateString("fr-FR")}
              </p>
            </li>
          ))}
          {profile.coachNotes.length === 0 && (
            <p className="text-sm text-menhir-navy/50">Aucune note pour le moment.</p>
          )}
        </ul>
      </Card>
    </div>
  );
}
