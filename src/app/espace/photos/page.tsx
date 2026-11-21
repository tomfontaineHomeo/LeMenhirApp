import { redirect } from "next/navigation";
import Image from "next/image";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui";

export default async function MesPhotosPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const profile = await prisma.studentProfile.findUnique({
    where: { userId: session.user.id },
    include: { photos: { orderBy: { createdAt: "desc" } } },
  });

  if (!profile) redirect("/espace");

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <h1 className="text-2xl font-bold text-menhir-navy">Mes photos</h1>
      <Card className="p-6">
        {profile.photos.length === 0 ? (
          <p className="text-sm text-menhir-navy/60">
            Ton moniteur n&apos;a pas encore ajouté de photo. Elles
            apparaîtront ici après tes prochaines sessions !
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {profile.photos.map((photo) => (
              <div key={photo.id} className="space-y-1">
                <div className="relative aspect-square overflow-hidden rounded-xl bg-menhir-paleblue">
                  <Image
                    src={photo.url}
                    alt={photo.caption ?? "Photo de session"}
                    fill
                    className="object-cover"
                  />
                </div>
                {photo.caption && (
                  <p className="text-xs text-menhir-navy/60">
                    {photo.caption}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
