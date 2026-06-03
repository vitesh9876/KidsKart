const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    description: String,
    category: {
      type: String,
      required: true,
    },
    ageGroup: {
      type: String,
      required: true,
    },
    brand: String,
    stock: {
      type: Number,
      default: 10,
    },
    rating: {
      type: Number,
      default: 4.5,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
