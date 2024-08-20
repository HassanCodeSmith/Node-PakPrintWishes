const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    product_brand_id: {
      type: mongoose.Types.ObjectId,
      ref: "brand",

      // required: true,
    },
    product_category_id: {
      type: mongoose.Types.ObjectId,
      ref: "parent_category",
      default: null,

      // required: true,
    },
    product_child_category_id: {
      type: mongoose.Types.ObjectId,
      ref: "subCategory",
      default: null,
      // required: true,
    },
    product_title: {
      type: String,
      required: true,
    },
    product_description: {
      type: String,
      required: true,
    },
    old_price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      // required: true,
    },
    new_price: {
      type: Number,
      // required: true,
    },
    shiping_fee: {
      type: Number,
      // required: true,
    },
    product_advance: Number,
    delivered_days: {
      type: String,
      // required: true,
    },
    images: { type: [String], required: true },
    featured_product: {
      type: Boolean,
      default: false,
    },
    product_new_arrival: {
      type: Boolean,
      default: false,
    },
    buynow: {
      type: Boolean,
      default: false,
    },
    product_type: {
      type: String,
      required: true,
    },
    productCode: {
      type: String,
      unique: true,
      default: null,
    },
    product_model: String,
    size: String,
    connectivity_technologies: String,
    printing_technologies: String,
    printer_color: String,
    print_media: String,
    scanner_type: String,
    compatible_devices: String,
    salesCount: Number,
    product_status: {
      type: Boolean,
      default: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    vendor: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    permanentDeleted: {
      type: Boolean,
      default: false,
    },
    minQuantity: {
      type: Number,
    },
    // productIdCode: {
    //   type: String,
    // },
    accessories_condition: String,
    accessories_type: String,
    accessories_Location: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("product", productSchema);
