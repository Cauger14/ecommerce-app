// components/cardProduct.tsx
"use client";
import { useState } from "react";
import { api } from "~/trpc/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { AddCircleIcon } from "@hugeicons/core-free-icons";

const ITEMS_PER_PAGE = 9;

export function CardProduct() {
  const [page, setPage] = useState(1);
  const { data: products, isLoading } = api.product.getAll.useQuery();

  if (isLoading) return <p>Chargement...</p>;
  if (!products || products.length === 0) return <p>Aucun produit trouvé.</p>;

  // Calcul de la pagination
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = products.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );



  return (
    <div>
      {/* Grille de produits */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {paginatedProducts.map((product) => (
          <div
            key={product.id}
            className="rounded-lg bg-white p-4 text-black shadow"
          >
            <img
              src={product.image}
              alt={product.name}
              className="mb-3 h-48 w-full rounded object-cover"
            />
            <h2 className="text-lg font-bold">{product.name}</h2>
            <p className="text-sm text-gray-500">{product.category.name}</p>

            <div className="mt-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xl font-semibold">
                  {Number(product.price)} €
                </p>
                <p className="text-sm text-gray-400">Stock : {product.stock}</p>
              </div>

              <button
                onClick={() => []}
                className="flex-shrink-0 cursor-pointer rounded-full p-1 transition-colors hover:bg-gray-100 active:scale-95"
              >
                <HugeiconsIcon
                  icon={AddCircleIcon}
                  size={28}
                  color="currentColor"
                  className="text-blue-600"
                  strokeWidth={1.5}
                />
              </button>
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
