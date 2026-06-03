const mongoose = require("mongoose");
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
require("dotenv").config();
const Product = require("./models/Product");

// Pools of high-quality FirstCry webp CDN images grouped by category
const imagesPool = {
  "Boy Fashion": [
    "https://cdn.fcglcdn.com/brainbees/images/products/zoom/babyhug-cotton-woven-shirt-full-sleeve-mandarin-collar-blue-18-24-months-22190716zzsq.webp",
    "https://cdn.fcglcdn.com/brainbees/images/products/zoom/kuchipoo-cotton-blend-pack-of-5-full-sleeves-solid-tees-red-blue-black-white-and-navy-blue-20215087zzsq.webp",
    "https://cdn.fcglcdn.com/brainbees/images/products/zoom/bt-dezines-full-sleeves-abstract-printed-sequined-kurta-pajama-set-turquoise-blue-18739606zzsq.webp",
    "https://cdn.fcglcdn.com/brainbees/images/products/zoom/cavio-cotton-lycra-full-sleeves-abstract-printed-shirt-and-tee-light-blue-18657949zzsq.webp",
    "https://cdn.fcglcdn.com/brainbees/images/products/zoom/bt-dezines-cotton-blend-woven-full-sleeves-solid-4-piece-party-suit-with-tie-set-onion-pink-21343264zzsq.webp",
    "https://cdn.fcglcdn.com/brainbees/images/products/zoom/vastramay-full-sleeves-solid-kurta-with-pyjama-white-11695821zzsq.webp"
  ],
  "Girl Fashion": [
    "https://cdn.fcglcdn.com/brainbees/images/products/zoom/cucumber-sinker-knit-full-sleeves-frock-with-frill-detailing-and-star-print-pink-18602111zzsq.webp",
    "https://cdn.fcglcdn.com/brainbees/images/products/zoom/babyhug-woven-three-fourth-sleeves-choli-with-lehenga-and-dupatta-set-with-floral-sequin-and-embroidery-with-lace-detailing-wine-and-pink-20380696zzsq.webp",
    "https://cdn.fcglcdn.com/brainbees/images/products/zoom/babyhug-georgette-woven-frill-sleeves-lehenga-choli-and-dupatta-set-with-embroidery-maroon-20472207zzsq.webp",
    "https://cdn.fcglcdn.com/brainbees/images/products/zoom/babyhug-woven-half-sleeves-ethnic-dress-with-brocade-design-fuschia-21216893zzsq.webp",
    "https://cdn.fcglcdn.com/brainbees/images/products/zoom/hola-bonita-knit-three-fourth-sleeves-solid-color-textured-dress-with-belt-blue-20874359zzsq.webp",
    "https://cdn.fcglcdn.com/brainbees/images/products/zoom/fashion-dream-cotton-woven-three-fourth-sleeves-floral-printed-gota-lace-embellished-coordinating-kurti-and-sharara-set-white-20872470zzsq.webp"
  ],
  "Toys": [
    "https://cdn.fcglcdn.com/brainbees/images/products/zoom/united-agencies-2-in-1-joy-pull-along-rattle-color-may-vary-11044483zzsq.webp",
    "https://cdn.fcglcdn.com/brainbees/images/products/zoom/yamama-balance-dino-car-toys-for-kids-with-lights-and-sound-fun-entertainment-kids-toys-pack-of-1-color-may-vary-21714288zzsq.webp",
    "https://cdn.fcglcdn.com/brainbees/images/products/zoom/toykraftt-seashells-shellbinding-craft-art-and-craft-kit-for-kids-for-age-8-12-years-9400163zzsq.webp",
    "https://cdn.fcglcdn.com/brainbees/images/products/zoom/new-pinch-led-acrylic-writing-board-with-light-and-7-pens-30x20-cm-diy-3d-rewritable-message-pad-personalized-night-lamp-and-display-board-for-home-office-desk-kids-and-gifts-big-22760129zzsq.webp",
    "https://cdn.fcglcdn.com/brainbees/images/products/zoom/disney-princess-ariel-doll-with-sparkling-clothing-height-285-cm-colour-and-decorations-may-vary-13900193zzsq.webp",
    "https://cdn.fcglcdn.com/brainbees/images/products/zoom/funblast-stress-relieving-silicone-pop-it-fidget-toy-color-may-vary-9524054zzsq.webp"
  ],
  "Baby Gear": [
    "https://cdn.fcglcdn.com/brainbees/images/products/zoom/echo-boomers-17-inches-glossy-bird-backpack-durable-comfortable-and-stylish-with-detachable-pouch-red-20521472zzsq.webp",
    "https://cdn.fcglcdn.com/brainbees/images/products/zoom/echo-boomers-blue-skating-bag-for-kids-and-teens-time-to-skate-print-20610015zzsq.webp",
    "https://cdn.fcglcdn.com/brainbees/images/products/zoom/echo-boomers-17-inches-glossy-bird-backpack-durable-comfortable-and-stylish-with-detachable-pouch-blue-20521479zzsq.webp",
    "https://cdn.fcglcdn.com/brainbees/images/products/zoom/bembika-free-size-flower-detailed-sling-bag-red-flower-20239891zzsq.webp",
    "https://cdn.fcglcdn.com/brainbees/images/products/zoom/echo-boomers-17-inches-glossy-bird-backpack-durable-comfortable-and-stylish-with-detachable-pouch-red-20521472zzsq.webp",
    "https://cdn.fcglcdn.com/brainbees/images/products/zoom/echo-boomers-blue-skating-bag-for-kids-and-teens-time-to-skate-print-20610015zzsq.webp"
  ],
  "Feeding & Nursing": [
    "https://cdn.fcglcdn.com/brainbees/images/products/zoom/syga-silicone-baby-bottle-brush-set-of-3-blue-10621236zzsq.webp",
    "https://cdn.fcglcdn.com/brainbees/images/products/zoom/syga-city-road-printed-waterproof-feeding-bib-with-sleeves-white-black-10621249zzsq.webp",
    "https://cdn.fcglcdn.com/brainbees/images/products/zoom/syga-silicone-baby-bottle-brush-set-of-3-blue-10621236zzsq.webp",
    "https://cdn.fcglcdn.com/brainbees/images/products/zoom/syga-city-road-printed-waterproof-feeding-bib-with-sleeves-white-black-10621249zzsq.webp",
    "https://cdn.fcglcdn.com/brainbees/images/products/zoom/syga-silicone-baby-bottle-brush-set-of-3-blue-10621236zzsq.webp",
    "https://cdn.fcglcdn.com/brainbees/images/products/zoom/syga-city-road-printed-waterproof-feeding-bib-with-sleeves-white-black-10621249zzsq.webp"
  ],
  "Bath & Skin": [
    "https://cdn.fcglcdn.com/brainbees/images/products/zoom/badal-kidz-moti-with-thread-for-teething-babies-and-oral-care-original-tlismi-moti-for-baby-teething-pain-pack-of-3-20285972zzsq.webp",
    "https://cdn.fcglcdn.com/brainbees/images/products/zoom/badal-kidz-moti-with-thread-for-teething-babies-and-oral-care-original-tlismi-moti-for-baby-teething-pain-pack-of-3-20285972zzsq.webp",
    "https://cdn.fcglcdn.com/brainbees/images/products/zoom/badal-kidz-moti-with-thread-for-teething-babies-and-oral-care-original-tlismi-moti-for-baby-teething-pain-pack-of-3-20285972zzsq.webp",
    "https://cdn.fcglcdn.com/brainbees/images/products/zoom/badal-kidz-moti-with-thread-for-teething-babies-and-oral-care-original-tlismi-moti-for-baby-teething-pain-pack-of-3-20285972zzsq.webp",
    "https://cdn.fcglcdn.com/brainbees/images/products/zoom/badal-kidz-moti-with-thread-for-teething-babies-and-oral-care-original-tlismi-moti-for-baby-teething-pain-pack-of-3-20285972zzsq.webp",
    "https://cdn.fcglcdn.com/brainbees/images/products/zoom/badal-kidz-moti-with-thread-for-teething-babies-and-oral-care-original-tlismi-moti-for-baby-teething-pain-pack-of-3-20285972zzsq.webp"
  ]
};

// Clean, realistic descriptions and brands corresponding to each category
const productDetailsMap = {
  "Boy Fashion": {
    brands: ["Carter's", "Pine Kids", "Kuchipoo", "Gini & Jony", "U.S. Polo Assn.", "Babyhug"],
    titles: {
      "0-2 Years": [
        "Cotton Romper Suit", "Printed Sleepsuit", "Cotton Bodysuit", 
        "Full Sleeves Footie", "Newborn Casual Tee", "Infant Lounge Pant"
      ],
      "3-5 Years": [
        "Dino Printed Cotton T-Shirt", "Striped Polo T-Shirt", "Cotton Joggers Set",
        "Denim Shorts", "Bear Print Hooded Sweatshirt", "Casual Cotton Shirt"
      ],
      "6-10 Years": [
        "Slim Fit Stretch Jeans", "Graphic Print Active Tee", "Collared Polo T-Shirt",
        "Traditional Kurta Pajama Set", "Comfort Fleece Tracksuit", "Active Playground Shorts"
      ],
      "11-15 Years": [
        "Sportswear Windbreaker Jacket", "Athletic Track Pant", "Chino Cotton Trousers",
        "Highneck Pullover Sweater", "Oxford Cotton Collar Shirt", "Dry-Fit Training Tee"
      ]
    },
    desc: "Soft breathable fabrics styled with clean fits, designed to endure daily play and washes."
  },
  "Girl Fashion": {
    brands: ["Bella Moda", "Cucumber", "Babyhug", "Hola Bonita", "Fashion Dream", "Pine Kids"],
    titles: {
      "0-2 Years": [
        "Frilled Cotton Frock", "Nursery Sleepy Onesie", "Floral Printed Romper",
        "Sleeveless Summer Slip", "Cotton Lounge Frock", "Knit Cap Sleeves Top"
      ],
      "3-5 Years": [
        "Floral Organza Party Dress", "Casual A-Line Summer Dress", "Printed Lace Lehenga Choli",
        "Lycra Top & Shorts Set", "Textured Knit Frock with Belt", "Casual Cotton Jumpsuit"
      ],
      "6-10 Years": [
        "Georgette Embroidered Lehenga Set", "Premium Denim Dungaree", "Butterfly Print Trouser Set",
        "Ankle Length Leggings (Pack of 3)", "Party Wear Frock with Lace", "Tropical Floral Skirt Set"
      ],
      "11-15 Years": [
        "Floral Tiered Maxi Dress", "High-Waist Denim Skirt", "Active Knit Hoodie Set",
        "Comfortable Cotton Palazzo Set", "Elegant Party Gown", "Chambray Casual Jumpsuit"
      ]
    },
    desc: "Vibrant designs crafted from premium, skin-friendly fabrics for maximum durability and style."
  },
  "Toys": {
    brands: ["United Agencies", "Yamama", "Toykraftt", "New Pinch", "Disney", "FunBlast", "Eduspark", "Sanjary", "Baybee"],
    titles: {
      "0-2 Years": [
        "2-in-1 Joy Pull Along Rattle", "Musical Sound Teether Rattle Set", "Cute Soft Stuffed Plush Dino",
        "Cuddly Teddy Bear Plush", "Steam Engine Pull and Go Train", "Vehicles Matching Board Puzzle"
      ],
      "3-5 Years": [
        "Balance Dino Car with Sound", "Fish-Shaped Wooden Mosaic Puzzle", "Wooden Gardening Tools Set",
        "Alphabet & Number Puzzle Board", "5-in-1 Montessori Logarithmic Board", "Silicone Pop It Sensory Toy"
      ],
      "6-10 Years": [
        "Seashells Art and Craft Kit", "1:32 Scale Die-Cast Sports Car", "Ariel Princess Doll with Tiara",
        "46-Piece Garden Block Puzzle", "Avengers Jigsaw Puzzle (60 Pcs)", "Portable Kitchen Suitcase Playset"
      ],
      "11-15 Years": [
        "LED Acrylic Rewritable Message Board", "Creative Nail Art Styling Kit", "Magnetic Safety Dartboard Set",
        "DIY Wooden Peg Dolls Painting Set", "Avenger Handheld Water Game Toy", "Velvet Board Coloring Kit"
      ]
    },
    desc: "Engaging and educational play tools manufactured with 100% child-safe, non-toxic materials."
  },
  "Baby Gear": {
    brands: ["LuvLap", "R for Rabbit", "Babyhug", "Mee Mee", "Echo Boomers", "Bembika"],
    titles: {
      "0-2 Years": [
        "Sunshine Recline Baby Stroller", "Convertible Safety Car Seat", "Convertible High Dining Chair",
        "Royal Baby Walker with Toys", "Organic Cotton Carry Cot", "Baby Sleeping Sleeping Bag"
      ],
      "3-5 Years": [
        "Kick Scooter with LED Wheels", "Balance Training Kids Bicycle", "Anti-Lost Safety Wrist Band",
        "Deluxe Kids Tricycle", "Adjustable Dining Booster Seat", "Multipurpose Plastic Toy Chest"
      ],
      "6-10 Years": [
        "Glossy Bird Backpack with Pouch", "Double Zipper Lunch Box Kit", "Ergonomic Orthopedic School Bag",
        "Skating Carry Bag with Safety Straps", "Marvel Avengers Pencil Case pouch", "Stainless Steel Thermos Bottle"
      ],
      "11-15 Years": [
        "High-Capacity Travel Rucksack", "Digital Alarm Desk Organiser", "Compact Gadget Backpack",
        "Skating Sling Bag for Active Teens", "Double Compartment Canvas Pencil Case", "Durable Sports Water Jug"
      ]
    },
    desc: "Ergonomically designed travel and storage items built to ensure child safety and comfort."
  },
  "Feeding & Nursing": {
    brands: ["Philips Avent", "Pigeon", "Chicco", "Mee Mee", "Syga", "LuvLap"],
    titles: {
      "0-2 Years": [
        "Anti-Colic Feeding Bottle Set", "Silicone Pacifier Soother", "Soft Silicone Bib with Crumb Catcher",
        "Silicone Baby Bottle Brush Set", "Sleeved Waterproof Feeding Bib", "Newborn Milk Powder Container"
      ],
      "3-5 Years": [
        "Toddler Sippy Cup with Straw", "Self-Feeding Spoon & Fork Set", "Divided Bamboo Feeding Plate",
        "Waterproof Sleeveless Toddler Bib", "Insulated Food Thermos Jar", "Silicone Training Mug"
      ],
      "6-10 Years": [
        "Leakproof Lunch Box with Utensils", "Double Wall Stainless Steel Tumbler", "Compartmentalized Meal Tray",
        "Kids Travel Cutlery Set", "Insulated Lunch Cooler Bag", "Reusable Fruit Infuser Bottle"
      ],
      "11-15 Years": [
        "High Capacity Bento Lunch Box", "Insulated Sports Sipper Bottle", "Stainless Steel Straw Tumbler",
        "Portable Meal Prep Container Set", "Teen Active Thermal Lunch Carrier", "Glass Hydration Bottle"
      ]
    },
    desc: "Convenient, hygienic, and travel-friendly feeding tools made with food-grade BPA-free plastics."
  },
  "Bath & Skin": {
    brands: ["Sebamed", "Johnson's", "Himalaya", "Cetaphil Kids", "Badal Kidz", "Babyhug"],
    titles: {
      "0-2 Years": [
        "Extra Soft Soap-Free Baby Wash", "Nourishing Baby Massage Oil", "Hypoallergenic Baby Powder",
        "Teething beads with Oral Care Threads", "Calming Lavender Baby Lotion", "No-Tears Mild Baby Shampoo"
      ],
      "3-5 Years": [
        "Bubble Bath Soap for Toddlers", "Detangling Hair Spray for Kids", "Fruit Scented Foam Body Wash",
        "Moisturizing Sunscreen SPF 30", "Soft Cotton Bath Towel Set", "Mild Hand Wash (Pack of 3)"
      ],
      "6-10 Years": [
        "Sensitive Skin Moisturizer", "Gentle Cleansing bar soap", "Anti-Dandruff Kid Shampoo",
        "Aloe Vera Soothing Gel", "Organic Cotton Washcloths (Pack of 5)", "Kid-Safe Fruity Lip Balm"
      ],
      "11-15 Years": [
        "Acne-Control Gentle Facial Foamer", "Teen Sports Body Spray Deo", "Lightweight Oil-Free Sunscreen SPF 50",
        "Hydrating Shea Butter Body Lotion", "Deep Clean Teen Charcoal Scrub", "Hydrating Hydrosol Face Mist"
      ]
    },
    desc: "Dermatologically tested formulations balanced with 5.5 pH protection for sensitive skin."
  }
};

const categoriesList = ["Boy Fashion", "Girl Fashion", "Toys", "Baby Gear", "Feeding & Nursing", "Bath & Skin"];
const ageGroupsList = ["0-2 Years", "3-5 Years", "6-10 Years", "11-15 Years"];

// Programmatically generate 144 items (6 items * 6 categories * 4 age groups)
const generateProducts = () => {
  const generated = [];

  for (const category of categoriesList) {
    const categoryInfo = productDetailsMap[category];
    const imagePool = imagesPool[category];

    for (const ageGroup of ageGroupsList) {
      const titles = categoryInfo.titles[ageGroup];

      for (let i = 0; i < 6; i++) {
        // Build product parameters
        const title = `${categoryInfo.brands[i % categoryInfo.brands.length]} ${titles[i]}`;
        const price = 150 + (i * 180) + (category === "Baby Gear" ? 800 : 0); // Price variation
        const rating = (4.0 + (i * 0.15) % 1.0).toFixed(1);
        const stock = i === 4 ? 0 : 5 + i * 4; // Vary stock level, make item 4 "Out of Stock"
        const image = imagePool[i % imagePool.length];
        const brand = categoryInfo.brands[i % categoryInfo.brands.length];
        const description = `${title}. ${categoryInfo.desc} A perfect choice for age group ${ageGroup}.`;

        generated.push({
          title,
          price,
          image,
          description,
          category,
          ageGroup,
          brand,
          stock,
          rating: Number(rating)
        });
      }
    }
  }

  return generated;
};

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for FirstCry 144 item seeding...");

    // Clear existing products
    await Product.deleteMany({});
    console.log("Cleared old products.");

    // Generate and Insert products
    const products = generateProducts();
    await Product.insertMany(products);
    console.log(`Successfully seeded ${products.length} correct & proper products in MongoDB!`);

    mongoose.connection.close();
    console.log("DB connection closed.");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDB();
