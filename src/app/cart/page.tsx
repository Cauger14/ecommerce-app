import { CartProductList } from "~/components/cartProductList";
import { api } from "~/trpc/server";
import { getSession } from "~/server/better-auth/server";

export default function Cart() {
  void api.cart.getCart.prefetch();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <div className="mx-8 mt-6 mb-6 rounded-2xl border border-white/20 bg-white/10 p-20 shadow-2xl backdrop-blur-md">
        <CartProductList />
      </div>
    </main>
  );
}
