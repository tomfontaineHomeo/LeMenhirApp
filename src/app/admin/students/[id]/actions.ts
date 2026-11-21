"use server";

import { revalidatePath } from "next/cache";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { uploadStudentPhoto } from "@/lib/supabase";

async function requireStaff() {
  const session = await auth();
  if (!session?.user || !["ADMIN", "INSTRUCTOR"].includes(session.user.role)) {
    throw new Error("Non autorisé.");
  }
  return session.user;
}

export async function updateLevelAction(formData: FormData) {
  await requireStaff();
  const studentProfileId = formData.get("studentProfileId") as string;
  const level = formData.get("level") as string;

  await prisma.studentProfile.update({
    where: { id: studentProfileId },
    data: { level: level as never },
  });

  revalidatePath(`/admin/students/${studentProfileId}`);
}

export async function addLessonAction(formData: FormData) {
  const staff = await requireStaff();
  const studentProfileId = formData.get("studentProfileId") as string;
  const discipline = formData.get("discipline") as string;
  const durationHours = parseFloat(formData.get("durationHours") as string);
  const date = formData.get("date") as string;
  const windConditions = (formData.get("windConditions") as string) || null;
  const notes = (formData.get("notes") as string) || null;

  await prisma.$transaction([
    prisma.lesson.create({
      data: {
        studentProfileId,
        instructorId: staff.id,
        discipline: discipline as never,
        durationHours,
        date: date ? new Date(date) : new Date(),
        windConditions,
        notes,
        levelAtLesson: (
          await prisma.studentProfile.findUniqueOrThrow({
            where: { id: studentProfileId },
            select: { level: true },
          })
        ).level,
      },
    }),
    prisma.studentProfile.update({
      where: { id: studentProfileId },
      data: { hoursRemaining: { decrement: durationHours } },
    }),
  ]);

  revalidatePath(`/admin/students/${studentProfileId}`);
}

export async function addNoteAction(formData: FormData) {
  const staff = await requireStaff();
  const studentProfileId = formData.get("studentProfileId") as string;
  const content = (formData.get("content") as string)?.trim();
  if (!content) return;

  await prisma.coachNote.create({
    data: { studentProfileId, authorId: staff.id, content },
  });

  revalidatePath(`/admin/students/${studentProfileId}`);
}

export async function addPackAction(formData: FormData) {
  await requireStaff();
  const studentProfileId = formData.get("studentProfileId") as string;
  const name = (formData.get("name") as string)?.trim();
  const hoursPurchased = parseFloat(formData.get("hoursPurchased") as string);

  if (!name || Number.isNaN(hoursPurchased)) return;

  await prisma.$transaction([
    prisma.pack.create({
      data: { studentProfileId, name, hoursPurchased },
    }),
    prisma.studentProfile.update({
      where: { id: studentProfileId },
      data: { hoursRemaining: { increment: hoursPurchased } },
    }),
  ]);

  revalidatePath(`/admin/students/${studentProfileId}`);
}

export async function uploadPhotoAction(formData: FormData) {
  const staff = await requireStaff();
  const studentProfileId = formData.get("studentProfileId") as string;
  const caption = (formData.get("caption") as string) || null;
  const isProfilePhoto = formData.get("isProfilePhoto") === "on";
  const file = formData.get("photo") as File | null;

  if (!file || file.size === 0) return;

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) return;

  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const fileName = `${studentProfileId}/${crypto.randomUUID()}.${ext}`;

  const buffer = Buffer.from(await file.arrayBuffer());
  const publicUrl = await uploadStudentPhoto(fileName, buffer, file.type);

  if (isProfilePhoto) {
    await prisma.photo.updateMany({
      where: { studentProfileId, isProfilePhoto: true },
      data: { isProfilePhoto: false },
    });
  }

  await prisma.photo.create({
    data: {
      studentProfileId,
      uploadedById: staff.id,
      url: publicUrl,
      caption,
      isProfilePhoto,
    },
  });

  revalidatePath(`/admin/students/${studentProfileId}`);
  revalidatePath(`/espace`);
}
