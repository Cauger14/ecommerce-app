// app/page.tsx
import { CardProduct } from "~/components/cardProduct";
import { getSession } from "~/server/better-auth/server";
import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {
  const session = await getSession();
  
  void api.product.getAll.prefetch();

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
        <div className="mx-8 mt-6 mb-6 rounded-2xl border border-white/20 bg-white/10 p-20 shadow-2xl backdrop-blur-md">
          <h1 className="p-10 text-5xl">
            Bienvenue sur mon site e-commerce hasardeux
          </h1>
          <CardProduct />
        </div>
      </main>
    </HydrateClient>
  );
}