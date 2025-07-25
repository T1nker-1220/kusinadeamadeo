// src/lib/menu.ts
// This is the ONLY file you or another AI will ever need to edit to update the menu.
// After editing this file, simply run: pnpm sync-menu

export const menuData = [
  {
    category: "Budget Meals",
    products: [
      {
        name: "Beef Chaofan",
        price: 50,
        description: "Beef Fried Rice Chinese Style",
        owner: "nat",
        image: "/images/products/beef-chaofan.jpg",
        is_available: true,
        options: [
          { group: "Add-ons", name: "Add Siomai", price: 5, is_available: true },
          { group: "Add-ons", name: "Add Shanghai", price: 5, is_available: true },
          { group: "Add-ons", name: "Add Egg", price: 15, is_available: true },
        ],
      },
      {
        name: "Hamsilog",
        price: 55,
        description: "Ham, Sinangag, Itlog",
        owner: "nat",
        image: "/images/products/hamsilog.jpg",
        is_available: true,
        options: [],
      },
      {
        name: "Hotsilog",
        price: 60,
        description: "Hotdog, Sinangag, Itlog",
        owner: "mama",
        image: "/images/products/hotsilog.jpg",
        is_available: true,
        options: [],
      },
      {
        name: "Pork Chaofan",
        price: 50,
        description: "Pork Fried Rice Chinese Style",
        owner: "nat",
        image: "/images/products/pork-chaofan.jpg",
        is_available: true,
        options: [
          { group: "Add-ons", name: "Add Siomai", price: 5, is_available: true },
          { group: "Add-ons", name: "Add Shanghai", price: 5, is_available: true },
          { group: "Add-ons", name: "Add Egg", price: 15, is_available: true },
        ],
      },
      {
        name: "Shanghai Rice",
        price: 50,
        description: "6 pcs Shanghai with Rice",
        owner: "nat",
        image: "/images/products/shanghai-rice.jpg",
        is_available: true,
        options: [],
      },
      {
        name: "Silog",
        price: 35,
        description: "Sinangag, Itlog",
        owner: "mama",
        image: "/images/products/silog.jpg",
        is_available: true,
        options: [],
      },
      {
        name: "Siomai Rice",
        price: 50,
        description: "6 pcs Siomai with Rice",
        owner: "nat",
        image: "/images/products/siomai-rice.jpg",
        is_available: true,
        options: [],
      },
      {
        name: "Skinless",
        price: 50,
        description: "3 pcs Skinless Longganisa with Rice",
        owner: "nat",
        image: "/images/products/skinless.jpg",
        is_available: true,
        options: [],
      },
    ],
  },
  {
    category: "Silog Meals",
    products: [
      {
        name: "Bangsilog",
        price: 100,
        description: "Fried Bangus, Sinangag, Itlog",
        owner: "mama",
        image: "/images/products/bangsilog.jpg",
        is_available: true,
        options: [],
      },
      {
        name: "Chicksilog",
        price: 95,
        description: "Fried Chicken, Sinangag, Itlog",
        owner: "mama",
        image: "/images/products/chicksilog.jpg",
        is_available: true,
        options: [],
      },
      {
        name: "Porksilog",
        price: 95,
        description: "Pork Chop, Sinangag, Itlog",
        owner: "mama",
        image: "/images/products/porksilog.jpg",
        is_available: true,
        options: [],
      },
      {
        name: "Sisigsilog",
        price: 95,
        description: "Pork Sisig, Sinangag, Itlog",
        owner: "mama",
        image: "/images/products/sisigsilog.jpg",
        is_available: true,
        options: [],
      },
      {
        name: "Tapsilog",
        price: 100,
        description: "Beef Tapa, Sinangag, Itlog",
        owner: "mama",
        image: "/images/products/tapasilog.jpg",
        is_available: true,
        options: [],
      },
      {
        name: "Tocilog",
        price: 85,
        description: "Pork Tocino, Sinangag, Itlog",
        owner: "mama",
        image: "/images/products/tocilog.jpg",
        is_available: true,
        options: [],
      },
    ],
  },
  {
    category: "Ala Carte",
    products: [
      {
        name: "9 Cheesestick",
        price: 15,
        description: "9 pieces of crispy cheesesticks",
        owner: "nat",
        image: "/images/products/cheesetick.jpg",
        is_available: true,
        options: [],
      },
      {
        name: "Fries",
        price: 25,
        description: "Classic french fries",
        owner: "nat",
        image: "/images/products/fries.jpg",
        is_available: true,
        options: [],
      },

      {
        name: "Graham Bar",
        price: 20,
        description: "Sweet graham dessert bar",
        owner: "nat",
        image: "/images/products/grahambar.jpg",
        is_available: true,
        options: [],
      },

      {
        name: "Mami (Beef)",
        price: 45,
        description: "Beef noodle soup",
        owner: "mama",
        image: "/images/products/beef-mami.jpg",
        is_available: false,
        options: [],
      },
      {
        name: "Pares",
        price: 60,
        description: "Braised beef stew with rice",
        owner: "mama",
        image: "/images/products/pares.jpg",
        is_available: false,
        options: [],
      },

      {
        name: "Burger",
        price: 25,
        description: "Classic burger",
        owner: "mama",
        image: "/images/products/logo.png",
        is_available: true,
        options: [],
      },
      {
        name: "Egg Sandwich",
        price: 30,
        description: "Sandwich with egg",
        owner: "mama",
        image: "/images/products/logo.png",
        is_available: true,
        options: [],
      },
      {
        name: "Ham Sandwich",
        price: 30,
        description: "Sandwich with ham",
        owner: "mama",
        image: "/images/products/logo.png",
        is_available: true,
        options: [],
      },
      {
        name: "Hotdog Sandwich",
        price: 35,
        description: "Sandwich with hotdog",
        owner: "mama",
        image: "/images/products/logo.png",
        is_available: true,
        options: [],
      },
    ],
  },
  {
    category: "Drinks",
    products: [
      {
        name: "Coke Float",
        price: 0,
        description: "Coke with vanilla ice cream",
        owner: "mama",
        image: "/images/products/coke-float.jpg",
        is_available: true,
        options: [
          { group: "Size", name: "Medium", price: 29, is_available: true },
          { group: "Size", name: "Large", price: 39, is_available: true },
        ],
      },
      {
        name: "Fruit Soda",
        price: 0,
        description: "Refreshing soda with fruit flavors",
        owner: "mama",
        image: "/images/products/fruit-soda.png",
        is_available: true,
        options: [
          { group: "Size", name: "16oz", price: 29, is_available: true },
          { group: "Size", name: "22oz", price: 39, is_available: true },
          { group: "Flavor", name: "Mango", price: 0, is_available: true },
          { group: "Flavor", name: "Blueberry", price: 0, is_available: true },
          { group: "Flavor", name: "Passion Fruit", price: 0, is_available: true },
          { group: "Flavor", name: "Strawberry", price: 0, is_available: true },
          { group: "Flavor", name: "Mixed Berries", price: 0, is_available: true },
          { group: "Flavor", name: "Green Apple", price: 0, is_available: true },
          { group: "Flavor", name: "Lychee", price: 0, is_available: true },
          { group: "Flavor", name: "Melon", price: 0, is_available: true },
        ],
      },
      {
        name: "Hot Coffee",
        price: 15,
        description: "Classic hot coffee",
        owner: "mama",
        image: "/images/products/hot-coffee.jpg",
        is_available: true,
        options: [],
      },
      {
        name: "Iced Coffee",
        price: 29,
        description: "Classic iced coffee",
        owner: "mama",
        image: "/images/products/iced-coffee.jpg",
        is_available: true,
        options: [],
      },
      {
        name: "Coke",
        price: 23,
        description: "Coca-Cola soft drink",
        owner: "mama",
        image: "/images/products/logo.png",
        is_available: true,
        options: [],
      },
      {
        name: "Mountain Dew",
        price: 23,
        description: "Mountain Dew soft drink",
        owner: "mama",
        image: "/images/products/logo.png",
        is_available: true,
        options: [],
      },
      {
        name: "Bottled Water",
        price: 10,
        description: "Purified bottled water",
        owner: "mama",
        image: "/images/products/logo.png",
        is_available: true,
        options: [],
      },
    ],
  },
  {
    category: "Specialty Beverages",
    products: [
      {
        name: "Iced Chocolate w/ Pearl",
        price: 49,
        description: "Iced chocolate with tapioca pearls",
        owner: "mama",
        image: "/images/products/logo.png",
        is_available: true,
        options: [],
      },
      {
        name: "Iced Coffee w/ Pearl",
        price: 39,
        description: "Iced coffee with tapioca pearls",
        owner: "mama",
        image: "/images/products/iced-coffee.jpg",
        is_available: true,
        options: [],
      },
    ],
  },
  {
    category: "Additional Items",
    products: [
      {
        name: "Burger Steak",
        price: 65,
        description: "Burger patty with rice and gravy",
        owner: "mama",
        image: "/images/products/logo.png",
        is_available: false,
        options: [],
      },
      {
        name: "Cheeseburger",
        price: 50,
        description: "Classic cheeseburger",
        owner: "mama",
        image: "/images/products/logo.png",
        is_available: true,
        options: [],
      },
      {
        name: "Halo-Halo",
        price: 0,
        description: "Classic Filipino shaved ice dessert",
        owner: "mama",
        image: "/images/products/logo.png",
        is_available: true,
        options: [
          { group: "Size", name: "16oz", price: 35, is_available: true },
          { group: "Size", name: "22oz", price: 50, is_available: true },
        ],
      },
      {
        name: "Mais con Yelo",
        price: 35,
        description: "Sweet corn dessert with shaved ice",
        owner: "mama",
        image: "/images/products/logo.png",
        is_available: true,
        options: [],
      },
      {
        name: "Siopao",
        price: 25,
        description: "Steamed bun with filling",
        owner: "mama",
        image: "/images/products/logo.png",
        is_available: false,
        options: [],
      },
    ],
  },
]; 