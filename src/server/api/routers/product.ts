import z from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const productRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const products = await ctx.db.product.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });

    return products.map((product) => ({
      ...product,
      price: Number(product.price),
    }));
  }),

  getByName: publicProcedure
    .input(z.object({ name: z.string() })) // on attend un objet avec un champ name
    .query(async ({ ctx, input }) => {
      return ctx.db.product.findMany({
        where: { name: input.name }, // on cherche le produit avec cet name
        include: { category: true },
      });
    }),
});
