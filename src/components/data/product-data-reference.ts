// Types for product management
type ProductBase = {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  basePrice: number | null; // null when product only uses variant prices
  imageUrl: string;
  isAvailable: boolean;
  allowsAddons: boolean;
}

type ProductVariant = {
  id: string;
  productId: string;
  type: 'SIZE' | 'FLAVOR';
  name: string;
  price: number;
  stock: number;
  isAvailable: boolean;
  imageUrl?: string; // Optional, only for variants that need different images
}

type GlobalAddon = {
  id: string;
  name: string;
  price: number;
  isAvailable: boolean;
}

// Product Categories with proper image handling
const categories = [
  {
    id: "cat_budget_meals",
    name: "Budget Meals",
    description: "Affordable meal options for everyone",
    imageUrl: "/images/categories/budget-meals.png", // Available
    sortOrder: 1
  },
  {
    id: "cat_silog_meals",
    name: "Silog Meals",
    description: "Filipino breakfast combinations with rice and egg",
    imageUrl: "/images/categories/silog-meals.png", // Available
    sortOrder: 2
  },
  {
    id: "cat_ala_carte",
    name: "Ala Carte",
    description: "Individual dishes and snacks",
    imageUrl: "/images/categories/ala-carte.png", // Available
    sortOrder: 3
  },
  {
    id: "cat_beverages",
    name: "Beverages",
    description: "Refreshing drinks and beverages",
    imageUrl: "/images/categories/beverages.png", // Available
    sortOrder: 4
  }
];

// Budget Meals Products
const budgetMeals = {
  hotsilog: {
    product: {
      id: "prod_hotsilog",
      categoryId: "cat_budget_meals",
      name: "Hotsilog",
      description: "Hotdog with Sinangag (Fried Rice) and Itlog (Egg)",
      basePrice: 60,
      imageUrl: "/images/products/hotsilog.png", // Available
      isAvailable: true,
      allowsAddons: true
    }
  },
  hamsilog: {
    product: {
      id: "prod_hamsilog",
      categoryId: "cat_budget_meals",
      name: "Hamsilog",
      description: "Ham with Sinangag (Fried Rice) and Itlog (Egg)",
      basePrice: 55,
      imageUrl: "/images/products/hamsilog.png", // Available
      isAvailable: true,
      allowsAddons: true
    }
  },
  silog: {
    product: {
      id: "prod_silog",
      categoryId: "cat_budget_meals",
      name: "Silog",
      description: "Sinangag (Fried Rice) and Itlog (Egg)",
      basePrice: 35,
      imageUrl: "/images/products/silog.png", // Available
      isAvailable: true,
      allowsAddons: true
    }
  },
  skinlessRice: {
    product: {
      id: "prod_skinless_rice",
      categoryId: "cat_budget_meals",
      name: "Skinless Rice",
      description: "Skinless Longganisa with Fried Rice",
      basePrice: 40,
      imageUrl: "/images/products/skinless-rice.png", // Available
      isAvailable: true,
      allowsAddons: true
    }
  },
  porkChaofan: {
    product: {
      id: "prod_pork_chaofan",
      categoryId: "cat_budget_meals",
      name: "Pork Chaofan",
      description: "Pork Fried Rice Chinese Style",
      basePrice: 45,
      imageUrl: "/images/products/pork-chaofan.png", // Available
      isAvailable: true,
      allowsAddons: true
    }
  },
  beefChaofan: {
    product: {
      id: "prod_beef_chaofan",
      categoryId: "cat_budget_meals",
      name: "Beef Chaofan",
      description: "Beef Fried Rice Chinese Style",
      basePrice: 50,
      imageUrl: "/images/products/beef-chaofan.png", // Available
      isAvailable: true,
      allowsAddons: true
    }
  },
  siomaiRice: {
    product: {
      id: "prod_siomai_rice",
      categoryId: "cat_budget_meals",
      name: "Siomai Rice",
      description: "Siomai with Fried Rice",
      basePrice: 39,
      imageUrl: "/images/products/siomai-rice.png", // Available
      isAvailable: true,
      allowsAddons: true
    }
  },
  shanghaiRice: {
    product: {
      id: "prod_shanghai_rice",
      categoryId: "cat_budget_meals",
      name: "Shanghai Rice",
      description: "Lumpia Shanghai with Rice",
      basePrice: 39,
      imageUrl: "/images/products/shanghai-rice.png", // Available
      isAvailable: true,
      allowsAddons: true
    }
  }
};

// Silog Meals Products
const silogMeals = {
  tapsilog: {
    product: {
      id: "prod_tapsilog",
      categoryId: "cat_silog_meals",
      name: "Tapsilog",
      description: "Beef Tapa with Sinangag and Itlog",
      basePrice: 100,
      imageUrl: "/images/products/tapsilog.png", // Available
      isAvailable: true,
      allowsAddons: true
    }
  },
  porksilog: {
    product: {
      id: "prod_porksilog",
      categoryId: "cat_silog_meals",
      name: "Porksilog",
      description: "Porkchop with Sinangag and Itlog",
      basePrice: 95,
      imageUrl: "/images/products/porksilog.png", // Available
      isAvailable: true,
      allowsAddons: true
    }
  },
  chicksilog: {
    product: {
      id: "prod_chicksilog",
      categoryId: "cat_silog_meals",
      name: "Chicksilog",
      description: "Chicken with Sinangag and Itlog",
      basePrice: 95,
      imageUrl: "/images/products/chicksilog.png", // Available
      isAvailable: true,
      allowsAddons: true
    }
  },
  bangsilog: {
    product: {
      id: "prod_bangsilog",
      categoryId: "cat_silog_meals",
      name: "Bangsilog",
      description: "Bangus with Sinangag and Itlog",
      basePrice: 100,
      imageUrl: "/images/products/bangsilog.png", // Available
      isAvailable: true,
      allowsAddons: true
    }
  },
  sisigsilog: {
    product: {
      id: "prod_sisigsilog",
      categoryId: "cat_silog_meals",
      name: "Sisigsilog",
      description: "Sisig with Sinangag and Itlog",
      basePrice: 95,
      imageUrl: "/images/products/sisigsilog.png", // Available
      isAvailable: true,
      allowsAddons: true
    }
  },
  tocilog: {
    product: {
      id: "prod_tocilog",
      categoryId: "cat_silog_meals",
      name: "Tocilog",
      description: "Tocino with Sinangag and Itlog",
      basePrice: 85,
      imageUrl: "/images/products/tocilog.png", // Available
      isAvailable: true,
      allowsAddons: true
    }
  }
};

// Ala Carte Products
const alaCarte = {
  lugaw: {
    product: {
      id: "prod_lugaw",
      categoryId: "cat_ala_carte",
      name: "Lugaw",
      description: "Filipino Rice Porridge",
      basePrice: 20,
      imageUrl: "/images/products/lugaw.png", // Available
      isAvailable: true,
      allowsAddons: false
    }
  },
  goto: {
    product: {
      id: "prod_goto",
      categoryId: "cat_ala_carte",
      name: "Goto",
      description: "Rice Porridge with Beef Tripe",
      basePrice: 35,
      imageUrl: "/images/products/goto.png", // Available
      isAvailable: true,
      allowsAddons: false
    }
  },
  beefMami: {
    product: {
      id: "prod_beef_mami",
      categoryId: "cat_ala_carte",
      name: "Beef Mami",
      description: "Beef Noodle Soup",
      basePrice: 45,
      imageUrl: "/images/products/beef-mami.png", // Available
      isAvailable: true,
      allowsAddons: false
    }
  },
  pares: {
    product: {
      id: "prod_pares",
      categoryId: "cat_ala_carte",
      name: "Pares",
      description: "Beef Stew with Rice",
      basePrice: 60,
      imageUrl: "/images/products/pares.png", // Available
      isAvailable: true,
      allowsAddons: false
    }
  },
  fries: {
    product: {
      id: "prod_fries",
      categoryId: "cat_ala_carte",
      name: "Fries",
      description: "Crispy French Fries",
      basePrice: 25,
      imageUrl: "/images/products/fries.png", // Available
      isAvailable: true,
      allowsAddons: false
    }
  },
  waffle: {
    product: {
      id: "prod_waffle",
      categoryId: "cat_ala_carte",
      name: "Waffle",
      description: "Fresh Baked Waffle",
      basePrice: null,
      imageUrl: "/images/products/waffle.png", // Available
      isAvailable: true,
      allowsAddons: false
    },
    variants: [
      {
        id: "var_waffle_chocolate",
        productId: "prod_waffle",
        type: "FLAVOR",
        name: "Chocolate",
        price: 15
      },
      {
        id: "var_waffle_cheese",
        productId: "prod_waffle",
        type: "FLAVOR",
        name: "Cheese",
        price: 15
      },
      {
        id: "var_waffle_hotdog",
        productId: "prod_waffle",
        type: "FLAVOR",
        name: "Hotdog",
        price: 15
      }
    ]
  },
  grahamBar: {
    product: {
      id: "prod_graham_bar",
      categoryId: "cat_ala_carte",
      name: "Graham Bar",
      description: "Graham Cracker Dessert Bar",
      basePrice: 20,
      imageUrl: "/images/products/graham-bar.png", // Available
      isAvailable: true,
      allowsAddons: false
    }
  },
  cheeseStick: {
    product: {
      id: "prod_cheese_stick",
      categoryId: "cat_ala_carte",
      name: "Cheese Stick",
      description: "Crispy Cheese Stick (6 pieces per order)",
      basePrice: 10,
      imageUrl: "/images/products/cheese-stick.png", // Available
      isAvailable: true,
      allowsAddons: false
    }
  },
  siomai: {
    product: {
      id: "prod_siomai",
      categoryId: "cat_ala_carte",
      name: "Siomai",
      description: "Chinese-style Siomai",
      basePrice: null,
      imageUrl: "/images/products/siomai-rice.png", // Using siomai-rice image as fallback
      isAvailable: true,
      allowsAddons: false
    },
    variants: [
      {
        id: "var_siomai_chicken",
        productId: "prod_siomai",
        type: "FLAVOR",
        name: "Chicken",
        price: 5,
        imageUrl: "/images/variants/siomai-chicken.png" // Available
      },
      {
        id: "var_siomai_beef",
        productId: "prod_siomai",
        type: "FLAVOR",
        name: "Beef",
        price: 5
      }
    ]
  }
};

// Beverages Products
const beverages = {
  cokeFloat: {
    product: {
      id: "prod_coke_float",
      categoryId: "cat_beverages",
      name: "Coke Float",
      description: "Coca-Cola with Ice Cream",
      basePrice: null,
      imageUrl: "/images/products/fruit-soda.png", // Using fruit-soda as placeholder
      isAvailable: true,
      allowsAddons: false
    },
    variants: [
      {
        id: "var_coke_16oz",
        productId: "prod_coke_float",
        type: "SIZE",
        name: "16oz",
        price: 29,
        imageUrl: "/images/variants/coke-float-16oz.png" // Available
      },
      {
        id: "var_coke_22oz",
        productId: "prod_coke_float",
        type: "SIZE",
        name: "22oz",
        price: 39
      }
    ]
  },
  icedCoffee: {
    product: {
      id: "prod_iced_coffee",
      categoryId: "cat_beverages",
      name: "Iced Coffee",
      description: "Cold Brewed Coffee with Ice (22oz)",
      basePrice: 29,
      imageUrl: "/images/products/iced-coffee.png", // Available
      isAvailable: true,
      allowsAddons: false
    }
  },
  hotCoffee: {
    product: {
      id: "prod_hot_coffee",
      categoryId: "cat_beverages",
      name: "Hot Coffee",
      description: "Hot Brewed Coffee",
      basePrice: 29,
      imageUrl: "/images/products/hot-coffee.png", // Available
      isAvailable: true,
      allowsAddons: false
    }
  },
  fruitSoda: {
    product: {
      id: "prod_fruit_soda",
      categoryId: "cat_beverages",
      name: "Fruit Soda",
      description: "Refreshing Fruit-flavored Soda",
      basePrice: null,
      imageUrl: "/images/products/fruit-soda.png",
      isAvailable: true,
      allowsAddons: false
    },
    variants: [
      {
        id: "var_blueberry_16oz",
        productId: "prod_fruit_soda",
        type: "FLAVOR",
        name: "Blueberry 16oz",
        price: 29,
        stock: 50,
        isAvailable: true,
        imageUrl: "/images/variants/blueberry-16oz.png"
      },
      {
        id: "var_strawberry_16oz",
        productId: "prod_fruit_soda",
        type: "FLAVOR",
        name: "Strawberry 16oz",
        price: 29,
        stock: 45,
        isAvailable: true,
        imageUrl: "/images/variants/strawberry-16oz.png"
      },
      {
        id: "var_lemon_16oz",
        productId: "prod_fruit_soda",
        type: "FLAVOR",
        name: "Lemon 16oz",
        price: 29,
        stock: 50,
        isAvailable: true,
        imageUrl: "/images/variants/lemon-16oz.png"
      },
      {
        id: "var_greenapple_16oz",
        productId: "prod_fruit_soda",
        type: "FLAVOR",
        name: "Green Apple 16oz",
        price: 29,
        stock: 50,
        isAvailable: true,
        imageUrl: "/images/variants/greenapple-16oz.png"
      },
      {
        id: "var_lychee_16oz",
        productId: "prod_fruit_soda",
        type: "FLAVOR",
        name: "Lychee 16oz",
        price: 29,
        stock: 50,
        isAvailable: true,
        imageUrl: "/images/variants/lychee-16oz.png"
      },
      {
        id: "var_blueberry_22oz",
        productId: "prod_fruit_soda",
        type: "FLAVOR",
        name: "Blueberry 22oz",
        price: 39,
        stock: 50,
        isAvailable: true,
        imageUrl: "/images/variants/blueberry-22oz.png"
      },
      {
        id: "var_strawberry_22oz",
        productId: "prod_fruit_soda",
        type: "FLAVOR",
        name: "Strawberry 22oz",
        price: 39,
        stock: 50,
        isAvailable: true,
        imageUrl: "/images/variants/strawberry-22oz.png"
      },
      {
        id: "var_lemon_22oz",
        productId: "prod_fruit_soda",
        type: "FLAVOR",
        name: "Lemonade 22oz",
        price: 39,
        stock: 50,
        isAvailable: true,
        imageUrl: "/images/variants/lemon-22oz.png"
      },
      {
        id: "var_greenapple_22oz",
        productId: "prod_fruit_soda",
        type: "FLAVOR",
        name: "Green Apple 22oz",
        price: 39,
        stock: 50,
        isAvailable: true,
        imageUrl: "/images/variants/greenapple-22oz.png"
      },
      {
        id: "var_lychee_22oz",
        productId: "prod_fruit_soda",
        type: "FLAVOR",
        name: "Lychee 22oz",
        price: 39,
        stock: 50,
        isAvailable: true,
        imageUrl: "/images/variants/lychee-22oz.png"
      }
    ]
  }
};

// Global Add-ons List
const globalAddons: GlobalAddon[] = [
  {
    id: "addon_siomai",
    name: "Extra Siomai",
    price: 5,
    isAvailable: true
  },
  {
    id: "addon_shanghai",
    name: "Extra Shanghai",
    price: 5,
    isAvailable: true
  },
  {
    id: "addon_skinless",
    name: "Extra Skinless",
    price: 10,
    isAvailable: true
  },
  {
    id: "addon_egg",
    name: "Extra Egg",
    price: 15,
    isAvailable: true
  },
  {
    id: "addon_hotdog",
    name: "Extra Hotdog",
    price: 15,
    isAvailable: true
  },
  {
    id: "addon_sauce",
    name: "Extra Sauce",
    price: 5,
    isAvailable: true
  }
];

// Image Status Tracking
const imageStatus = {
  available: {
    categories: [
      "budget-meals.png",
      "silog-meals.png",
      "ala-carte.png",
      "beverages.png"
    ],
    products: [
      // Budget Meals
      "hotsilog.png",
      "hamsilog.png",
      "silog.png",
      "skinless-rice.png",
      "pork-chaofan.png",
      "beef-chaofan.png",
      "siomai-rice.png",
      "shanghai-rice.png",

      // Silog Meals
      "bangsilog.png",
      "sisigsilog.png",
      "porksilog.png",
      "chicksilog.png",
      "tapsilog.png",
      "tocilog.png",

      // Ala Carte
      "lugaw.png",
      "goto.png",
      "beef-mami.png",
      "pares.png",
      "fries.png",
      "waffle.png",
      "graham-bar.png",
      "cheese-stick.png",
      "pastil.png",

      // Beverages
      "fruit-soda.png",
      "iced-coffee.png",
      "hot-coffee.png",

      // Components
      "egg.png",
      "rice.png"
    ],
    variants: [
      // Fruit Soda Variants
      "blueberry-16oz.png",
      "greenapple-16oz.png",
      "lemon-16oz.png",
      "lemon-22oz.png",
      "blueberry-22oz.png",
      "lychee-16oz.png",
      "greenapple-22oz.png",
      "strawberry-22oz.png",
      "strawberry-16oz.png",

      // Siomai Variants
      "siomai-chicken.png",

      // Coke Float Variants
      "coke-float-16oz.png"
    ]
  },
  missing: {
    products: [
      "coke-float.png"
    ],
    variants: [
      "coke-float-22oz.png",
      "siomai-beef.png",
      "lychee-22oz.png"
    ]
  }
};

// API Endpoints Reference
const variantEndpoints = {
  list: '/api/products/[id]/variants',
  create: '/api/products/[id]/variants',
  update: '/api/products/[id]/variants?variantId=[variantId]',
  delete: '/api/products/[id]/variants?variantId=[variantId]',
  stock: '/api/products/[id]/variants/stock'
};

// Stock Management Reference
const stockOperations = {
  increment: (currentStock: number) => currentStock + 1,
  decrement: (currentStock: number) => Math.max(0, currentStock - 1),
  set: (newStock: number) => Math.max(0, newStock),
  validate: (stock: number) => stock >= 0
};

// UI Components Reference
const variantComponents = {
  form: 'VariantForm', // For creating/editing variants
  list: 'VariantsList', // For displaying variants
  stockControls: 'StockControls', // Quick stock management
  availabilityToggle: 'AvailabilityToggle' // Availability management
};

// Export all constants and types
export {
  alaCarte,
  beverages, budgetMeals, categories, fruitSoda, globalAddons,
  imageStatus, silogMeals, stockOperations,
  variantComponents, variantEndpoints, type ProductBase,
  type ProductVariant
};
