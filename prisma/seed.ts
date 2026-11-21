import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL manquant (voir .env.example).");
}
const adapter = new PrismaPg(process.env.DATABASE_URL);
const prisma = new PrismaClient({ adapter });

const DEFAULT_PASSWORD = "LeMenhir2026!";

async function upsertStaff(name: string, email: string) {
  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);
  return prisma.user.upsert({
    where: { email },
    update: {},
    create: { name, email, passwordHash, role: "ADMIN" },
  });
}

async function main() {
  const quentin = await upsertStaff("Quentin", "quentin@lemenhirapp.fr");
  const tom = await upsertStaff("Tom", "tom@lemenhirapp.fr");

  const studentPasswordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);
  const student = await prisma.user.upsert({
    where: { email: "demo.eleve@lemenhirapp.fr" },
    update: {},
    create: {
      name: "Léa Démo",
      email: "demo.eleve@lemenhirapp.fr",
      phone: "06 00 00 00 00",
      passwordHash: studentPasswordHash,
      role: "STUDENT",
      studentProfile: {
        create: {
          level: "NAVIGATION_SURVEILLEE",
          hoursRemaining: 4,
          mainSpot: "Cabourg",
        },
      },
    },
    include: { studentProfile: true },
  });

  const studentProfileId = student.studentProfile!.id;

  const existingPacks = await prisma.pack.count({ where: { studentProfileId } });
  if (existingPacks === 0) {
    await prisma.pack.create({
      data: {
        studentProfileId,
        name: "Pack Initiation 10h",
        hoursPurchased: 10,
      },
    });
  }

  const existingLessons = await prisma.lesson.count({ where: { studentProfileId } });
  if (existingLessons === 0) {
    await prisma.lesson.createMany({
      data: [
        {
          studentProfileId,
          instructorId: quentin.id,
          discipline: "KITESURF",
          levelAtLesson: "INITIATION",
          durationHours: 2,
          date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20),
          windConditions: "15 noeuds, vent de face",
          notes: "Première séance : école de pilotage, bonnes sensations.",
        },
        {
          studentProfileId,
          instructorId: tom.id,
          discipline: "KITESURF",
          levelAtLesson: "NAVIGATION_SURVEILLEE",
          durationHours: 2,
          date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
          windConditions: "20 noeuds, vent de travers",
          notes: "Premières relances, travail du bord de near.",
        },
      ],
    });
  }

  const existingNotes = await prisma.coachNote.count({ where: { studentProfileId } });
  if (existingNotes === 0) {
    await prisma.coachNote.create({
      data: {
        studentProfileId,
        authorId: quentin.id,
        content: "Très à l'aise avec la gestion de l'aile, à encourager sur les relances.",
      },
    });
  }

  console.log("Seed terminé.");
  console.log(`Comptes admin : quentin@lemenhirapp.fr / tom@lemenhirapp.fr`);
  console.log(`Compte élève démo : demo.eleve@lemenhirapp.fr`);
  console.log(`Mot de passe (à changer) : ${DEFAULT_PASSWORD}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
