const fs = require("fs");
const mongoose = require("mongoose");
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
require("dotenv").config();
const Product = require("./models/Product");

const sitemapPath = "C:/Users/vites/.gemini/antigravity/brain/cbb8d15c-d099-499a-a816-9013d1e80d84/.system_generated/steps/331/content.md";

const parseSitemap = () => {
  const content = fs.readFileSync(sitemapPath, "utf8");
  const urls = [];
  
  const urlRegex = /<url>([\s\S]*?)<\/url>/g;
  let match;
  
  while ((match = urlRegex.exec(content)) !== null) {
    const block = match[1];
    
    const titleMatch = /<image:title>([\s\S]*?)<\/image:title>/.exec(block);
    const imgMatch = /<image:loc>([\s\S]*?)<\/image:loc>/.exec(block);
    
    if (titleMatch && imgMatch) {
      urls.push({
        title: titleMatch[1].trim(),
        image: imgMatch[1].trim()
      });
    }
  }
  
  return urls;
};

const getCategory = (title) => {
  const lower = title.toLowerCase();
  
  if (lower.includes("frock") || lower.includes("dress") || lower.includes("skirt") || lower.includes("girls") || lower.includes("lehenga") || lower.includes("choli")) {
    return "Girl Fashion";
  }
  if (lower.includes("shirt") || lower.includes("jeans") || lower.includes("kurta") || lower.includes("t-shirt") || lower.includes("tee") || lower.includes("pants") || lower.includes("boys") || lower.includes("shorts")) {
    return "Boy Fashion";
  }
  if (lower.includes("toy") || lower.includes("puzzle") || lower.includes("blocks") || lower.includes("game") || lower.includes("rattle") || lower.includes("board") || lower.includes("doll") || lower.includes("craft")) {
    return "Toys";
  }
  if (lower.includes("stroller") || lower.includes("seat") || lower.includes("walker") || lower.includes("cot") || lower.includes("high chair") || lower.includes("backpack") || lower.includes("bag")) {
    return "Baby Gear";
  }
  if (lower.includes("bottle") || lower.includes("pacifier") || lower.includes("soother") || lower.includes("bib") || lower.includes("cleanser") || lower.includes("feeder")) {
    return "Feeding & Nursing";
  }
  if (lower.includes("wash") || lower.includes("oil") || lower.includes("powder") || lower.includes("shampoo") || lower.includes("lotion") || lower.includes("soap") || lower.includes("teething")) {
    return "Bath & Skin";
  }
  return null;
};

const getAgeGroup = (title) => {
  const lower = title.toLowerCase();
  
  if (lower.includes("0-2") || lower.includes("months") || lower.includes("newborn") || lower.includes("infant") || lower.includes("baby") || lower.includes("soother") || lower.includes("pacifier") || lower.includes("rattle") || lower.includes("teething")) {
    if (lower.includes("18-24 months") || lower.includes("24 months")) return "0-2 Years";
    if (lower.includes("months") && !lower.includes("36 months")) return "0-2 Years";
    return "0-2 Years";
  }
  if (lower.includes("3-5") || lower.includes("years-3") || lower.includes("3 years") || lower.includes("4 years") || lower.includes("5 years") || lower.includes("toddler") || lower.includes("preschool")) {
    return "3-5 Years";
  }
  if (lower.includes("6-10") || lower.includes("6 years") || lower.includes("7 years") || lower.includes("8 years") || lower.includes("9 years") || lower.includes("10 years") || lower.includes("school") || lower.includes("backpack")) {
    return "6-10 Years";
  }
  if (lower.includes("11-15") || lower.includes("11 years") || lower.includes("12 years") || lower.includes("13 years") || lower.includes("14 years") || lower.includes("15 years") || lower.includes("teens") || lower.includes("teenager")) {
    return "11-15 Years";
  }
  return null;
};

const extractAndSeed = async () => {
  console.log("Parsing FirstCry sitemap file...");
  const rawProducts = parseSitemap();
  console.log(`Extracted ${rawProducts.length} raw products containing image mappings.`);
  
  const categorized = {};
  const categoriesList = ["Boy Fashion", "Girl Fashion", "Toys", "Baby Gear", "Feeding & Nursing", "Bath & Skin"];
  const ageGroupsList = ["0-2 Years", "3-5 Years", "6-10 Years", "11-15 Years"];
  
  for (const cat of categoriesList) {
    categorized[cat] = {};
    for (const age of ageGroupsList) {
      categorized[cat][age] = [];
    }
  }
  
  // Keep track of all matches for backfilling
  const poolByCategory = {};
  for (const cat of categoriesList) {
    poolByCategory[cat] = [];
  }
  
  for (const prod of rawProducts) {
    const cat = getCategory(prod.title);
    if (!cat) continue;
    
    // Clean up duplicate titles or images
    const isDuplicateGlobal = poolByCategory[cat].some(item => item.title === prod.title || item.image === prod.image);
    if (isDuplicateGlobal) continue;
    
    const words = prod.title.split(" ");
    const brand = words[0].length > 2 ? words[0] : "KidsKart";
    
    const productObj = {
      title: prod.title,
      price: 199 + (prod.title.length * 7) % 800,
      image: prod.image,
      description: `${prod.title}. High-quality FirstCry catalog product, designed with premium kid-safe components.`,
      category: cat,
      brand: brand,
      stock: (prod.title.length % 5 === 0) ? 0 : 5 + (prod.title.length % 15),
      rating: +(4.0 + (prod.title.length % 10) * 0.1).toFixed(1)
    };
    
    poolByCategory[cat].push(productObj);
    
    const age = getAgeGroup(prod.title);
    if (age && categorized[cat][age].length < 6) {
      categorized[cat][age].push({ ...productObj, ageGroup: age });
    }
  }
  
  // Backfill logic to ensure exactly 6 items per cell
  for (const cat of categoriesList) {
    for (const age of ageGroupsList) {
      let cell = categorized[cat][age];
      
      if (cell.length < 6) {
        // Find unused items from this category pool
        for (const item of poolByCategory[cat]) {
          if (cell.length >= 6) break;
          
          // Check if item is already used in any cell of this category
          const isUsed = ageGroupsList.some(a => 
            categorized[cat][a].some(existing => existing.title === item.title)
          );
          
          if (!isUsed) {
            cell.push({ ...item, ageGroup: age });
          }
        }
      }
    }
  }
  
  // Compile final array
  const finalSeededList = [];
  for (const cat of categoriesList) {
    for (const age of ageGroupsList) {
      finalSeededList.push(...categorized[cat][age]);
    }
  }
  
  console.log(`Successfully collected exactly ${finalSeededList.length} unique and matching products!`);
  
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for authentic seeding...");
    
    await Product.deleteMany({});
    console.log("Cleared old products.");
    
    await Product.insertMany(finalSeededList);
    console.log(`Database seeded successfully with exactly ${finalSeededList.length} products!`);
    
    mongoose.connection.close();
    console.log("DB connection closed.");
  } catch (err) {
    console.error("Database operation failed:", err);
  }
};

extractAndSeed();
