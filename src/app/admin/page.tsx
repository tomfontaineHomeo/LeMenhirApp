import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, LevelBadge } from "@/components/ui";

export default async function AdminStudentsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  const profiles = await prisma.studentProfile.findMany({
    where: q
      ? { user: { name: { contains: q } } }
      : undefined,
    include: {
      user: true,
      lessons: { orderBy: { date: "desc" }, take: 1 },
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-menhir-navy">
          Élèves de l&apos;école ({profiles.length})
        </h1>
        <form className="flex gap-2">
          <input
            type="text"
            name="q"
            defaultValue={q ?? ""}
            placeholder="Rechercher un élève..."
            className="rounded-lg border border-menhir-navy/20 px-3 py-2 text-sm outline-none focus:border-menhir-navy"
          />
        </form>
      </div>

      <Card className="overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-menhir-paleblue text-menhir-navy">
            <tr>
              <th className="px-4 py-3 font-semibold">Élève</th>
              <th className="px-4 py-3 font-semibold">Niveau</th>
              <th className="px-4 py-3 font-semibold">Heures restantes</th>
              <th className="px-4 py-3 font-semibold">Dernier cours</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-menhir-navy/10">
            {profiles.map((p) => (
              <tr key={p.id} className="hover:bg-menhir-paleblue/30">
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/students/${p.id}`}
                    className="font-medium text-menhir-navy hover:underline"
                  >
                    {p.user.name}
                  </Link>
                  <p className="text-xs text-menhir-navy/50">{p.user.email}</p>
                </td>
                <td className="px-4 py-3">
                  <LevelBadge level={p.level} />
                </td>
                <td className="px-4 py-3 text-menhir-navy">
                  {p.hoursRemaining}h
                </td>
                <td className="px-4 py-3 text-menhir-navy/70">
                  {p.lessons[0]
                    ? new Date(p.lessons[0].date).toLocaleDateString("fr-FR")
                    : "—"}
                </td>
              </tr>
            ))}
            {profiles.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-menhir-navy/50">
                  Aucun élève trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
