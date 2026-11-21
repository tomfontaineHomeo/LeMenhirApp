import { auth } from "@/auth";
import { AppHeader } from "@/components/app-header";

export default async function EspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader
        userName={session?.user?.name ?? "élève"}
        links={[
          { href: "/espace", label: "Mon espace" },
          { href: "/espace/photos", label: "Mes photos" },
        ]}
      />
      <div className="flex-1 px-6 py-8 sm:px-10">{children}</div>
    </div>
  );
}
