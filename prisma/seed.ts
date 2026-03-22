import { PrismaClient } from "generated/prisma";
import { faker } from "@faker-js/faker";

const db = new PrismaClient();

async function main() {
  // Créer des catégories
  const categories = await Promise.all([
    db.category.create({ data: { name: "Électronique", description: "Produits électroniques" } }),
    db.category.create({ data: { name: "Vêtements", description: "Vêtements et accessoires" } }),
    db.category.create({ data: { name: "Maison", description: "Produits pour la maison" } }),
  ]);

  // Créer un utilisateur admin
  const admin = await db.user.create({
    data: {
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      emailVerified: true,
      role: "ADMIN",
    },
  });

  // Créer 20 produits
  for (let i = 0; i < 20; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    await db.product.create({
      data: {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price({ min: 5, max: 500 })),
        stock: faker.number.int({ min: 0, max: 100 }),
        image: faker.image.urlPicsumPhotos({ width: 400, height: 300 }),
        categoryId: category!.id,
        createdById: admin.id,
      },
    });
  }

  console.log("✅ Seed terminé !");
}

main()
  .then(() => db.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });