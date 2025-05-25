const { Schema, model } = require("mongoose");

const MySchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
    _id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
      default: "",
    },
    price: {
      type: Number,
      required: true,
    },
    rating: {
      type: Number,
      required: false,
    },
    model: {
      type: String,
      required: false,
    },
    createdAt: {
      type: String,
      required: true,
    },
    updatedAt: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model("product_details", MySchema);
