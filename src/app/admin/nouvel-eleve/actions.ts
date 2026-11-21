"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function createStudentAction(
  _prevState: { error?: string } | undefined,
  formData: FormData,
): Promise<{ error?: string }> {
  const session = await auth();
  if (!session?.user || !["ADMIN", "INSTRUCTOR"].includes(session.user.role)) {
    return { error: "Non autorisé." };
  }

  const name = (formData.get("name") as string | null)?.trim();
  const email = (formData.get("email") as string | null)?.trim().toLowerCase();
  const phone = (formData.get("phone") as string | null)?.trim();
  const password = formData.get("password") as string | null;

  if (!name || !email || !password) {
    return { error: "Le nom, l'email et le mot de passe sont obligatoires." };
  }
  if (password.length < 6) {
    return { error: "Le mot de passe doit contenir au moins 6 caractères." };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "Un compte existe déjà avec cet email." };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      phone: phone || null,
      passwordHash,
      role: "STUDENT",
      studentProfile: { create: {} },
    },
    include: { studentProfile: true },
  });

  redirect(`/admin/students/${user.studentProfile!.id}?created=1`);
}
