import "~/styles/globals.css";
import Link from "next/link";
import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { TRPCReactProvider } from "~/trpc/react";
import { getSession } from "~/server/better-auth/server";
import { SignOutButton } from "~/components/signout-button";

export const metadata: Metadata = {
  title: "E-Commerce",
  description: "Mon site e-commerce",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getSession();

  return (
    <html lang="fr" className={`${geist.variable}`}>
      <body>
        <nav className="flex items-center justify-between border-b px-6 py-4">
          <Link href="/" className="text-xl font-bold">
            E-Commerce
          </Link>

          <div className="flex items-center gap-4">
            {session ? (
              // Connecté
              <>
                <span className="text-sm text-gray-600">
                  Bonjour, {session.user.name ?? session.user.email}
                </span>
                {session.user.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="text-sm text-purple-600 hover:underline"
                  >
                    Admin
                  </Link>
                )}
                <Link href="/cart" className="text-sm hover:underline">
                  Panier
                </Link>
                <Link href="/orders" className="text-sm hover:underline">
                  Mes commandes
                </Link>

                <SignOutButton />
              </>
            ) : (
              // Non connecté
              <>
                <Link href="/login" className="text-sm hover:underline">
                  Connexion
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
                >
                  S&apos;inscrire
                </Link>
              </>
            )}
          </div>
        </nav>

        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
