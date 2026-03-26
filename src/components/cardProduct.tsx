// components/cardProduct.tsx
"use client";
import { useState } from "react";
import { api } from "~/trpc/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { AddCircleIcon } from "@hugeicons/core-free-icons";
import { useSessionContext } from "~/app/providers";

const ITEMS_PER_PAGE = 9;

export function CardProduct() {
  const [page, setPage] = useState(1);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const session = useSessionContext();

  const { data: products, isLoading } = api.product.getAll.useQuery();

  // Mutation pour ajouter au panier
  const addToCart = api.cart.addToCart.useMutation({
    onSuccess: () => {
      setNotification({
        message: "Produit ajouté au panier !",
        type: "success",
      });
      setTimeout(() => setNotification(null), 3000);
    },
    onError: (error) => {
      setNotification({
        message: error.message || "Erreur lors de l'ajout au panier",
        type: "error",
      });
      setTimeout(() => setNotification(null), 3000);
    },
  });

  if (isLoading) return <p>Chargement...</p>;
  if (!products || products.length === 0)
    return <p>Aucun produit trouvé.</p>;

  // Calcul de la pagination
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = products.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handleAddToCart = (productId: string, stock: number) => {
    if (stock <= 0) {
      setNotification({
        message: "Ce produit n'est pas en stock",
        type: "error",
      });
      setTimeout(() => setNotification(null), 3000);
      return;
    }
    addToCart.mutate({ productId, quantity: 1 });
  };

  return (
    <div>
      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white font-semibold z-50 transition-all ${
            notification.type === "success"
              ? "bg-green-500"
              : "bg-red-500"
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* Grille de produits */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {paginatedProducts.map((product) => (
          <div
            key={product.id}
            className="rounded-lg bg-white p-4 text-black shadow hover:shadow-lg transition-shadow"
          >
            {/* Image du produit */}
            <div className="relative">
              <img
                src={product.image}
                alt={product.name}
                className="mb-3 h-48 w-full rounded object-cover"
              />
              {/* Badge de stock */}
              {product.stock <= 0 && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded flex items-center justify-center">
                  <span className="text-white font-bold">Rupture de stock</span>
                </div>
              )}
            </div>

            <h2 className="text-lg font-bold">{product.name}</h2>
            <p className="text-sm text-gray-500">{product.category.name}</p>

            {/* Description courte */}
            <p className="text-sm text-gray-600 mt-2 line-clamp-2">
              {product.description}
            </p>

            <div className="mt-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xl font-semibold">
                  {Number(product.price).toFixed(2)} €
                </p>
                <p
                  className={`text-sm ${
                    product.stock > 0 ? "text-gray-400" : "text-red-500"
                  }`}
                >
                  {product.stock > 0
                    ? `Stock : ${product.stock}`
                    : "Rupture de stock"}
                </p>
              </div>
              {/* Afficher le bouton seulement si session active */}
              {session && (
                <button
                  onClick={() =>
                    handleAddToCart(product.id, product.stock)
                  }
                  disabled={product.stock <= 0 || addToCart.isPending}
                  className="shrink-0 cursor-pointer rounded-full p-1 transition-all hover:bg-gray-100 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  title={
                    product.stock <= 0
                      ? "Produit indisponible"
                      : "Ajouter au panier"
                  }
                >
                  <HugeiconsIcon
                    icon={AddCircleIcon}
                    size={28}
                    color="currentColor"
                    className={`${
                      product.stock > 0 ? "text-blue-600" : "text-gray-400"
                    }`}
                    strokeWidth={1.5}
                  />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-8 flex items-center justify-center gap-2">
        <button
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page === 1}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Précédent
        </button>
        <span className="px-4">
          Page {page} / {totalPages}
        </span>
        <button
          onClick={() => setPage(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Suivant
        </button>
      </div>
    </div>
  );
}