"use client";

import { api } from "~/trpc/react";
import { useState } from "react";
import { Trash2, Plus, Minus } from "lucide-react";

export function CartProductList() {
  // Récupérer le panier
  const { data: cart, isLoading, refetch } = api.cart.getCart.useQuery();

  // Mutations
  const updateQuantity = api.cart.updateQuantity.useMutation({
    onSuccess: () => refetch(),
  });

  const removeFromCart = api.cart.removeFromCart.useMutation({
    onSuccess: () => refetch(),
  });

  const clearCart = api.cart.clearCart.useMutation({
    onSuccess: () => refetch(),
  });

  

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-500">Chargement du panier...</p>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <svg
          className="w-24 h-24 text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
        <p className="text-xl text-gray-600 font-medium">
          Aucun produit dans votre panier
        </p>
        <p className="text-gray-500">Commencez vos achats dès maintenant</p>
      </div>
    );
  }

  // Calcul du total
  const totalPrice = cart.items.reduce((total, item) => {
    return total + item.product.price * item.quantity;
  }, 0);

  const handleQuantityChange = (cartItemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemoveItem(cartItemId);
    } else {
      updateQuantity.mutate({ cartItemId, quantity: newQuantity });
    }
  };

  const handleRemoveItem = (cartItemId: string) => {
    removeFromCart.mutate({ cartItemId });
  };

  const handleClearCart = () => {
    if (window.confirm("Êtes-vous sûr de vouloir vider votre panier ?")) {
      clearCart.mutate();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mon panier</h1>
          <p className="text-gray-600 mt-2">
            {cart.items.length} produit{cart.items.length > 1 ? "s" : ""}
          </p>
        </div>
        {cart.items.length > 0 && (
          <button
            onClick={handleClearCart}
            className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            Vider le panier
          </button>
        )}
      </div>

      {/* Liste des produits */}
      <div className="space-y-4 mb-8">
        {cart.items.map((item) => (
          <div
            key={item.id}
            className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition"
          >
            {/* Image du produit */}
            <div className="flex-shrink-0">
              {item.product.image ? (
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
              ) : (
                <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500 text-sm">Pas d&apos;image</span>
                </div>
              )}
            </div>

            {/* Détails du produit */}
            <div className="flex-grow">
              <h3 className="text-lg font-semibold text-gray-900">
                {item.product.name}
              </h3>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {item.product.description}
              </p>
              <div className="mt-2">
                <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                  {item.product.category.name}
                </span>
              </div>
            </div>

            {/* Prix et quantité */}
            <div className="flex flex-col items-end justify-between">
              <div className="text-right">
                <p className="text-sm text-gray-600">Prix unitaire</p>
                <p className="text-lg font-semibold text-gray-900">
                  {item.product.price.toFixed(2)}€
                </p>
              </div>

              {/* Contrôles de quantité */}
              <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
                <button
                  onClick={() =>
                    handleQuantityChange(item.id, item.quantity - 1)
                  }
                  disabled={updateQuantity.isPending}
                  className="p-1 hover:bg-gray-100 transition disabled:opacity-50"
                  aria-label="Diminuer la quantité"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    handleQuantityChange(item.id, parseInt(e.target.value) || 1)
                  }
                  className="w-12 text-center border-0 focus:ring-0 font-semibold"
                />
                <button
                  onClick={() =>
                    handleQuantityChange(item.id, item.quantity + 1)
                  }
                  disabled={updateQuantity.isPending}
                  className="p-1 hover:bg-gray-100 transition disabled:opacity-50"
                  aria-label="Augmenter la quantité"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        <div className=" p-4">
            <button onClick={() => console.log()}
            className=" cursor-pointer  ">
                Commander
            </button>
        </div>
      </div>
    </div>
  );
}