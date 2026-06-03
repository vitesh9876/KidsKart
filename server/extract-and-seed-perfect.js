const fs = require("fs");
const mongoose = require("mongoose");
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
require("dotenv").config();
const Product = require("./models/Product");

const sitemapPath = "C:/Users/vites/.gemini/antigravity/brain/cbb8d15c-d099-499a-a816-9013d1e80d84/.system_generated/steps/331/content.md";

const run = async () => {
  try {
    console.log("Reading sitemap file...");
    const content = fs.readFileSync(sitemapPath, "utf8");
    const urlRegex = /<url>([\s\S]*?)<\/url>/g;
    const rawProducts = [];
    let match;
    
    while ((match = urlRegex.exec(content)) !== null) {
      const block = match[1];
      const titleMatch = /<image:title>([\s\S]*?)<\/image:title>/.exec(block);
      const imgMatch = /<image:loc>([\s\S]*?)<\/image:loc>/.exec(block);
      if (titleMatch && imgMatch) {
        rawProducts.push({
          title: titleMatch[1].trim(),
          image: imgMatch[1].trim()
        });
      }
    }
    console.log(`Successfully parsed sitemap. Found ${rawProducts.length} raw products.`);

    const categoriesList = ["Boy Fashion", "Girl Fashion", "Toys", "Baby Gear", "Feeding & Nursing", "Bath & Skin"];
    const ageGroupsList = ["0-2 Years", "3-5 Years", "6-10 Years", "11-15 Years"];

    // Initialize lists
    const pools = {
      "Boy Fashion": [],
      "Girl Fashion": [],
      "Toys": [],
      "Baby Gear": [],
      "Feeding & Nursing": [],
      "Bath & Skin": []
    };

    // Brand dictionaries to check and normalize
    const knownBrands = [
      "Babyhug", "Carter's", "Pine Kids", "Kuchipoo", "Gini & Jony", "U.S. Polo Assn.",
      "Bella Moda", "Cucumber", "Hola Bonita", "Fashion Dream", "United Agencies",
      "Yamama", "Toykraftt", "New Pinch", "Disney", "FunBlast", "LuvLap", "R for Rabbit",
      "Mee Mee", "Echo Boomers", "Bembika", "Philips Avent", "Pigeon", "Chicco", "Syga",
      "Sebamed", "Johnson's", "Himalaya", "Cetaphil Kids", "Babyoye"
    ];

    const cleanBrand = (rawTitle) => {
      const words = rawTitle.split(" ");
      const firstWord = words[0];
      
      // Match against known brands
      for (const brand of knownBrands) {
        if (rawTitle.toLowerCase().startsWith(brand.toLowerCase())) {
          return brand;
        }
      }

      // Fallback normalizer
      if (firstWord && firstWord.length > 2 && !/^[0-9]/.test(firstWord)) {
        // Title Case first word
        return firstWord.charAt(0).toUpperCase() + firstWord.slice(1).toLowerCase();
      }
      return "KidsKart";
    };

    const getCategory = (title) => {
      const lower = title.toLowerCase();
      
      // Explicitly exclude teething charms/moti/jewelry from Bath & Skin
      if (lower.includes("moti") || lower.includes("beads") || lower.includes("charm") || lower.includes("necklace") || lower.includes("bracelet")) {
        // Teething toys/charms should be Toys
        return "Toys";
      }

      if (lower.includes("frock") || lower.includes("dress") || lower.includes("skirt") || lower.includes("girls") || lower.includes("lehenga") || lower.includes("choli") || lower.includes("gown") || lower.includes("frocks") || lower.includes("dresses")) {
        return "Girl Fashion";
      }
      if (lower.includes("shirt") || lower.includes("jeans") || lower.includes("kurta") || lower.includes("t-shirt") || lower.includes("tee") || lower.includes("pants") || lower.includes("boys") || lower.includes("shorts") || lower.includes("pullover") || lower.includes("joggers")) {
        return "Boy Fashion";
      }
      if (lower.includes("toy") || lower.includes("puzzle") || lower.includes("blocks") || lower.includes("game") || lower.includes("rattle") || lower.includes("board") || lower.includes("doll") || lower.includes("craft") || lower.includes("plush") || lower.includes("stuffed") || lower.includes("play")) {
        return "Toys";
      }
      if (lower.includes("stroller") || lower.includes("car seat") || lower.includes("walker") || lower.includes("cot") || lower.includes("high chair") || lower.includes("backpack") || lower.includes("bag") || lower.includes("luggage") || lower.includes("carrier") || lower.includes("pram")) {
        return "Baby Gear";
      }
      if (lower.includes("bottle") || lower.includes("pacifier") || lower.includes("soother") || lower.includes("bib") || lower.includes("feeder") || lower.includes("sippy") || lower.includes("straw cup") || lower.includes("cutlery") || lower.includes("spoons") || lower.includes("tumbler")) {
        return "Feeding & Nursing";
      }
      if (lower.includes("wash") || lower.includes("oil") || lower.includes("powder") || lower.includes("shampoo") || lower.includes("lotion") || lower.includes("soap") || lower.includes("cream") || lower.includes("cleanse") || lower.includes("sunscreen") || lower.includes("bath") || lower.includes("wipes")) {
        return "Bath & Skin";
      }
      return null;
    };

    // Filter sitemap into category pools, ensuring 100% unique titles and images
    for (const prod of rawProducts) {
      const cat = getCategory(prod.title);
      if (!cat) continue;

      const isDup = pools[cat].some(item => 
        item.title.toLowerCase() === prod.title.toLowerCase() || 
        item.image === prod.image
      );
      if (isDup) continue;

      pools[cat].push(prod);
    }

    const finalProductsList = [];

    // Formulate 144 items: 24 unique items per category (6 items * 4 age groups)
    for (const category of categoriesList) {
      const pool = pools[category];
      console.log(`Category [${category}] has ${pool.length} unique candidates in sitemap.`);

      if (pool.length < 24) {
        throw new Error(`Critical: Sitemap does not contain 24 unique items for category: ${category}`);
      }

      // Distribute the top 24 unique candidates into 4 age groups (6 items each)
      for (let ageIndex = 0; ageIndex < 4; ageIndex++) {
        const ageGroup = ageGroupsList[ageIndex];
        
        for (let i = 0; i < 6; i++) {
          const itemIndex = (ageIndex * 6) + i;
          const candidate = pool[itemIndex];
          const brandName = cleanBrand(candidate.title);

          // Build description
          let descText = "";
          if (category === "Boy Fashion") {
            descText = `Premium comfortable cotton outfit. ${candidate.title} is designed for active play, outdoor adventures, and easy washing.`;
          } else if (category === "Girl Fashion") {
            descText = `Stunning, elegant and stylish clothing item. ${candidate.title} features skin-friendly soft premium fabrics.`;
          } else if (category === "Toys") {
            descText = `Engaging and educational play item. ${candidate.title} is made with child-safe, non-toxic materials for hours of creative fun.`;
          } else if (category === "Baby Gear") {
            descText = `Comfortable and reliable baby mobility/utility item. ${candidate.title} features ergonomic support and meets high safety standards.`;
          } else if (category === "Feeding & Nursing") {
            descText = `Hygienic and travel-friendly nursing solution. ${candidate.title} is manufactured with 100% food-grade, BPA-free components.`;
          } else {
            descText = `Dermatologically tested mild formulation. ${candidate.title} is balanced with 5.5 pH protection for sensitive baby skin.`;
          }

          // Price variation
          const basePrice = 149 + (itemIndex * 27) % 650;
          
          finalProductsList.push({
            title: candidate.title,
            price: basePrice,
            image: candidate.image,
            description: descText,
            category: category,
            ageGroup: ageGroup,
            brand: brandName,
            stock: i === 4 ? 0 : 6 + (i * 5), // Vary stock level, make item 4 "Out of Stock"
            rating: +(4.0 + (i * 0.16) % 1.0).toFixed(1)
          });
        }
      }
    }

    console.log(`Compiled exactly ${finalProductsList.length} unique items across all grids.`);

    // Connect to database and seed
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB database.");

    await Product.deleteMany({});
    console.log("Deleted old products.");

    await Product.insertMany(finalProductsList);
    console.log("Database seeded successfully with 144 proper products!");

    mongoose.connection.close();
    console.log("DB connection closed.");

  } catch (err) {
    console.error("Seeding process failed:", err);
  }
};

run();
