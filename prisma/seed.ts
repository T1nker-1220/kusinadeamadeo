import { PrismaClient, VariantType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Clean up existing data
  await prisma.orderItemAddon.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.globalAddon.deleteMany();

  console.log('Cleaned up existing data');

  // Seed Categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: "Budget Meals",
        description: "Affordable meal options for everyone",
        imageUrl: "/images/categories/budget-meals.png",
        sortOrder: 1
      }
    }),
    prisma.category.create({
      data: {
        name: "Silog Meals",
        description: "Filipino breakfast combinations with rice and egg",
        imageUrl: "/images/categories/silog-meals.png",
        sortOrder: 2
      }
    }),
    prisma.category.create({
      data: {
        name: "Ala Carte",
        description: "Individual dishes and snacks",
        imageUrl: "/images/categories/ala-carte.png",
        sortOrder: 3
      }
    }),
    prisma.category.create({
      data: {
        name: "Beverages",
        description: "Refreshing drinks and beverages",
        imageUrl: "/images/categories/beverages.png",
        sortOrder: 4
      }
    })
  ]);

  console.log('Categories seeded');

  const [budgetMeals, silogMeals, alaCarte, beverages] = categories;

  // Seed Budget Meals
  await Promise.all([
    prisma.product.create({
      data: {
        categoryId: budgetMeals.id,
        name: "Hotsilog",
        description: "Hotdog with Sinangag (Fried Rice) and Itlog (Egg)",
        basePrice: 60,
        imageUrl: "/images/products/hotsilog.png",
        isAvailable: true,
        allowsAddons: true
      }
    }),
    prisma.product.create({
      data: {
        categoryId: budgetMeals.id,
        name: "Hamsilog",
        description: "Ham with Sinangag (Fried Rice) and Itlog (Egg)",
        basePrice: 55,
        imageUrl: "/images/products/hamsilog.png",
        isAvailable: true,
        allowsAddons: true
      }
    }),
    prisma.product.create({
      data: {
        categoryId: budgetMeals.id,
        name: "Silog",
        description: "Sinangag (Fried Rice) and Itlog (Egg)",
        basePrice: 35,
        imageUrl: "/images/products/silog.png",
        isAvailable: true,
        allowsAddons: true
      }
    }),
    prisma.product.create({
      data: {
        categoryId: budgetMeals.id,
        name: "Skinless Rice",
        description: "Skinless Longganisa with Fried Rice",
        basePrice: 40,
        imageUrl: "/images/products/skinless-rice.png",
        isAvailable: true,
        allowsAddons: true
      }
    }),
    prisma.product.create({
      data: {
        categoryId: budgetMeals.id,
        name: "Pork Chaofan",
        description: "Pork Fried Rice Chinese Style",
        basePrice: 45,
        imageUrl: "/images/products/pork-chaofan.png",
        isAvailable: true,
        allowsAddons: true
      }
    }),
    prisma.product.create({
      data: {
        categoryId: budgetMeals.id,
        name: "Beef Chaofan",
        description: "Beef Fried Rice Chinese Style",
        basePrice: 50,
        imageUrl: "/images/products/beef-chaofan.png",
        isAvailable: true,
        allowsAddons: true
      }
    }),
    prisma.product.create({
      data: {
        categoryId: budgetMeals.id,
        name: "Siomai Rice",
        description: "Siomai with Fried Rice",
        basePrice: 39,
        imageUrl: "/images/products/siomai-rice.png",
        isAvailable: true,
        allowsAddons: true
      }
    }),
    prisma.product.create({
      data: {
        categoryId: budgetMeals.id,
        name: "Shanghai Rice",
        description: "Lumpia Shanghai with Rice",
        basePrice: 39,
        imageUrl: "/images/products/shanghai-rice.png",
        isAvailable: true,
        allowsAddons: true
      }
    })
  ]);

  console.log('Budget Meals seeded');

  // Seed Silog Meals
  await Promise.all([
    prisma.product.create({
      data: {
        categoryId: silogMeals.id,
        name: "Tapsilog",
        description: "Beef Tapa with Sinangag and Itlog",
        basePrice: 100,
        imageUrl: "/images/products/tapsilog.png",
        isAvailable: true,
        allowsAddons: true
      }
    }),
    prisma.product.create({
      data: {
        categoryId: silogMeals.id,
        name: "Porksilog",
        description: "Porkchop with Sinangag and Itlog",
        basePrice: 95,
        imageUrl: "/images/products/porksilog.png",
        isAvailable: true,
        allowsAddons: true
      }
    }),
    prisma.product.create({
      data: {
        categoryId: silogMeals.id,
        name: "Chicksilog",
        description: "Chicken with Sinangag and Itlog",
        basePrice: 95,
        imageUrl: "/images/products/chicksilog.png",
        isAvailable: true,
        allowsAddons: true
      }
    }),
    prisma.product.create({
      data: {
        categoryId: silogMeals.id,
        name: "Bangsilog",
        description: "Bangus with Sinangag and Itlog",
        basePrice: 100,
        imageUrl: "/images/products/bangsilog.png",
        isAvailable: true,
        allowsAddons: true
      }
    }),
    prisma.product.create({
      data: {
        categoryId: silogMeals.id,
        name: "Sisigsilog",
        description: "Sisig with Sinangag and Itlog",
        basePrice: 95,
        imageUrl: "/images/products/sisigsilog.png",
        isAvailable: true,
        allowsAddons: true
      }
    }),
    prisma.product.create({
      data: {
        categoryId: silogMeals.id,
        name: "Tocilog",
        description: "Tocino with Sinangag and Itlog",
        basePrice: 85,
        imageUrl: "/images/products/tocilog.png",
        isAvailable: true,
        allowsAddons: true
      }
    })
  ]);

  console.log('Silog Meals seeded');

  // Seed Ala Carte Products
  const waffleProduct = await prisma.product.create({
    data: {
      categoryId: alaCarte.id,
      name: "Waffle",
      description: "Fresh Baked Waffle",
      basePrice: 0,
      imageUrl: "/images/products/waffle.png",
      isAvailable: true,
      allowsAddons: false
    }
  });

  const siomaiProduct = await prisma.product.create({
    data: {
      categoryId: alaCarte.id,
      name: "Siomai",
      description: "Chinese-style Siomai",
      basePrice: 0,
      imageUrl: "/images/products/siomai-rice.png",
      isAvailable: true,
      allowsAddons: false
    }
  });

  await Promise.all([
    prisma.product.create({
      data: {
        categoryId: alaCarte.id,
        name: "Lugaw",
        description: "Filipino Rice Porridge",
        basePrice: 20,
        imageUrl: "/images/products/lugaw.png",
        isAvailable: true,
        allowsAddons: false
      }
    }),
    prisma.product.create({
      data: {
        categoryId: alaCarte.id,
        name: "Goto",
        description: "Rice Porridge with Beef Tripe",
        basePrice: 35,
        imageUrl: "/images/products/goto.png",
        isAvailable: true,
        allowsAddons: false
      }
    }),
    prisma.product.create({
      data: {
        categoryId: alaCarte.id,
        name: "Beef Mami",
        description: "Beef Noodle Soup",
        basePrice: 45,
        imageUrl: "/images/products/beef-mami.png",
        isAvailable: true,
        allowsAddons: false
      }
    }),
    prisma.product.create({
      data: {
        categoryId: alaCarte.id,
        name: "Pares",
        description: "Beef Stew with Rice",
        basePrice: 60,
        imageUrl: "/images/products/pares.png",
        isAvailable: true,
        allowsAddons: false
      }
    }),
    prisma.product.create({
      data: {
        categoryId: alaCarte.id,
        name: "Fries",
        description: "Crispy French Fries",
        basePrice: 25,
        imageUrl: "/images/products/fries.png",
        isAvailable: true,
        allowsAddons: false
      }
    }),
    prisma.product.create({
      data: {
        categoryId: alaCarte.id,
        name: "Graham Bar",
        description: "Graham Cracker Dessert Bar",
        basePrice: 20,
        imageUrl: "/images/products/graham-bar.png",
        isAvailable: true,
        allowsAddons: false
      }
    }),
    prisma.product.create({
      data: {
        categoryId: alaCarte.id,
        name: "Cheese Stick",
        description: "Crispy Cheese Stick (6 pieces per order)",
        basePrice: 10,
        imageUrl: "/images/products/cheese-stick.png",
        isAvailable: true,
        allowsAddons: false
      }
    })
  ]);

  // Add Waffle Variants
  await Promise.all([
    prisma.productVariant.create({
      data: {
        productId: waffleProduct.id,
        type: VariantType.FLAVOR,
        name: "Chocolate",
        price: 15
      }
    }),
    prisma.productVariant.create({
      data: {
        productId: waffleProduct.id,
        type: VariantType.FLAVOR,
        name: "Cheese",
        price: 15
      }
    }),
    prisma.productVariant.create({
      data: {
        productId: waffleProduct.id,
        type: VariantType.FLAVOR,
        name: "Hotdog",
        price: 15
      }
    })
  ]);

  // Add Siomai Variants
  await Promise.all([
    prisma.productVariant.create({
      data: {
        productId: siomaiProduct.id,
        type: VariantType.FLAVOR,
        name: "Chicken",
        price: 5,
        imageUrl: "/images/variants/siomai-chicken.png"
      }
    }),
    prisma.productVariant.create({
      data: {
        productId: siomaiProduct.id,
        type: VariantType.FLAVOR,
        name: "Beef",
        price: 5
      }
    })
  ]);

  console.log('Ala Carte Products seeded');

  // Seed Beverages
  const cokeFloatProduct = await prisma.product.create({
    data: {
      categoryId: beverages.id,
      name: "Coke Float",
      description: "Coca-Cola with Ice Cream",
      basePrice: 0,
      imageUrl: "/images/products/fruit-soda.png",
      isAvailable: true,
      allowsAddons: false
    }
  });

  const fruitSodaProduct = await prisma.product.create({
    data: {
      categoryId: beverages.id,
      name: "Fruit Soda",
      description: "Refreshing Fruit-flavored Soda",
      basePrice: 0,
      imageUrl: "/images/products/fruit-soda.png",
      isAvailable: true,
      allowsAddons: false
    }
  });

  await Promise.all([
    prisma.product.create({
      data: {
        categoryId: beverages.id,
        name: "Iced Coffee",
        description: "Cold Brewed Coffee with Ice (22oz)",
        basePrice: 29,
        imageUrl: "/images/products/iced-coffee.png",
        isAvailable: true,
        allowsAddons: false
      }
    }),
    prisma.product.create({
      data: {
        categoryId: beverages.id,
        name: "Hot Coffee",
        description: "Hot Brewed Coffee",
        basePrice: 29,
        imageUrl: "/images/products/hot-coffee.png",
        isAvailable: true,
        allowsAddons: false
      }
    })
  ]);

  // Add Coke Float Variants
  await Promise.all([
    prisma.productVariant.create({
      data: {
        productId: cokeFloatProduct.id,
        type: VariantType.SIZE,
        name: "16oz",
        price: 29,
        imageUrl: "/images/variants/coke-float-16oz.png"
      }
    }),
    prisma.productVariant.create({
      data: {
        productId: cokeFloatProduct.id,
        type: VariantType.SIZE,
        name: "22oz",
        price: 39
      }
    })
  ]);

  // Add Fruit Soda Variants
  await Promise.all([
    // 16oz Variants
    prisma.productVariant.create({
      data: {
        productId: fruitSodaProduct.id,
        type: VariantType.FLAVOR,
        name: "Blueberry 16oz",
        price: 29,
        imageUrl: "/images/variants/blueberry-16oz.png"
      }
    }),
    prisma.productVariant.create({
      data: {
        productId: fruitSodaProduct.id,
        type: VariantType.FLAVOR,
        name: "Strawberry 16oz",
        price: 29,
        imageUrl: "/images/variants/strawberry-16oz.png"
      }
    }),
    prisma.productVariant.create({
      data: {
        productId: fruitSodaProduct.id,
        type: VariantType.FLAVOR,
        name: "Lemon 16oz",
        price: 29,
        imageUrl: "/images/variants/lemon-16oz.png"
      }
    }),
    prisma.productVariant.create({
      data: {
        productId: fruitSodaProduct.id,
        type: VariantType.FLAVOR,
        name: "Green Apple 16oz",
        price: 29,
        imageUrl: "/images/variants/greenapple-16oz.png"
      }
    }),
    prisma.productVariant.create({
      data: {
        productId: fruitSodaProduct.id,
        type: VariantType.FLAVOR,
        name: "Lychee 16oz",
        price: 29,
        imageUrl: "/images/variants/lychee-16oz.png"
      }
    }),
    // 22oz Variants
    prisma.productVariant.create({
      data: {
        productId: fruitSodaProduct.id,
        type: VariantType.FLAVOR,
        name: "Blueberry 22oz",
        price: 39,
        imageUrl: "/images/variants/blueberry-22oz.png"
      }
    }),
    prisma.productVariant.create({
      data: {
        productId: fruitSodaProduct.id,
        type: VariantType.FLAVOR,
        name: "Strawberry 22oz",
        price: 39,
        imageUrl: "/images/variants/strawberry-22oz.png"
      }
    }),
    prisma.productVariant.create({
      data: {
        productId: fruitSodaProduct.id,
        type: VariantType.FLAVOR,
        name: "Lemonade 22oz",
        price: 39,
        imageUrl: "/images/variants/lemon-22oz.png"
      }
    }),
    prisma.productVariant.create({
      data: {
        productId: fruitSodaProduct.id,
        type: VariantType.FLAVOR,
        name: "Green Apple 22oz",
        price: 39,
        imageUrl: "/images/variants/greenapple-22oz.png"
      }
    }),
    prisma.productVariant.create({
      data: {
        productId: fruitSodaProduct.id,
        type: VariantType.FLAVOR,
        name: "Lychee 22oz",
        price: 39
      }
    })
  ]);

  console.log('Beverages seeded');

  // Seed Global Add-ons
  await Promise.all([
    prisma.globalAddon.create({
      data: {
        name: "Extra Siomai",
        price: 5,
        isAvailable: true
      }
    }),
    prisma.globalAddon.create({
      data: {
        name: "Extra Shanghai",
        price: 5,
        isAvailable: true
      }
    }),
    prisma.globalAddon.create({
      data: {
        name: "Extra Skinless",
        price: 10,
        isAvailable: true
      }
    }),
    prisma.globalAddon.create({
      data: {
        name: "Extra Egg",
        price: 15,
        isAvailable: true
      }
    }),
    prisma.globalAddon.create({
      data: {
        name: "Extra Hotdog",
        price: 15,
        isAvailable: true
      }
    }),
    prisma.globalAddon.create({
      data: {
        name: "Extra Sauce",
        price: 5,
        isAvailable: true
      }
    })
  ]);

  console.log('Global Add-ons seeded');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
