import z from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const cartRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const cartProducts = await ctx.db.product.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
    return cartProducts.map((product) => ({
      ...product,
      price: Number(product.price),
    }));
  }),

  getByUserId: protectedProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.product.findMany({
        where: { name: input.name },
        include: { category: true },
      });
    }),

  // ===== RÉCUPÉRER LE PANIER DE L'UTILISATEUR CONNECTÉ =====
  getCart: protectedProcedure.query(async ({ ctx }) => {
    const cart = await ctx.db.cart.findUnique({
      where: { userId: ctx.session.user.id },
      include: {
        items: {
          include: {
            product: {
              include: { category: true },
            },
          },
        },
      },
    });

    if (!cart) {
      return null;
    }

    // Convertir les Decimal en Number pour faciliter la manipulation
    return {
      ...cart,
      items: cart.items.map((item) => ({
        ...item,
        product: {
          ...item.product,
          price: Number(item.product.price),
        },
      })),
    };
  }),

  // ===== AJOUTER UN PRODUIT AU PANIER =====
  addToCart: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
        quantity: z.number().int().positive(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // Vérifier que le produit existe
      const product = await ctx.db.product.findUnique({
        where: { id: input.productId },
      });

      if (!product) {
        throw new Error("Produit introuvable");
      }

      // Récupérer ou créer le panier de l'utilisateur
      let cart = await ctx.db.cart.findUnique({
        where: { userId },
      });

      cart ??= await ctx.db.cart.create({
        data: { userId },
      });

      // Vérifier si le produit est déjà dans le panier
      const existingItem = await ctx.db.cartItem.findUnique({
        where: {
          cartId_productId: {
            cartId: cart.id,
            productId: input.productId,
          },
        },
      });

      if (existingItem) {
        // Mettre à jour la quantité
        return ctx.db.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + input.quantity },
        });
      } else {
        // Créer un nouvel item
        return ctx.db.cartItem.create({
          data: {
            cartId: cart.id,
            productId: input.productId,
            quantity: input.quantity,
          },
        });
      }
    }),

  // ===== SUPPRIMER UN PRODUIT DU PANIER =====
  removeFromCart: protectedProcedure
    .input(z.object({ cartItemId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.cartItem.delete({
        where: { id: input.cartItemId },
      });
    }),

  // ===== METTRE À JOUR LA QUANTITÉ =====
  updateQuantity: protectedProcedure
    .input(
      z.object({
        cartItemId: z.string(),
        quantity: z.number().int().positive(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.cartItem.update({
        where: { id: input.cartItemId },
        data: { quantity: input.quantity },
      });
    }),

  // ===== VIDER LE PANIER =====
  clearCart: protectedProcedure.mutation(async ({ ctx }) => {
    const cart = await ctx.db.cart.findUnique({
      where: { userId: ctx.session.user.id },
    });

    if (!cart) {
      return null;
    }

    await ctx.db.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return cart;
  }),
});
