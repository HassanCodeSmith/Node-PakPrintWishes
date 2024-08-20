const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    all_total_orders: {
      type: Number,
    },
    grand_total: {
      type: Number,
    },
    new_price_product: {
      type: Number,
    },
    quantity_product: {
      type: Number,
    },
    total_shipping_fee_orders: {
      type: Number,
    },
    status: {
      type: String,
    },
    bank_account_name: String,
    bank_account_no: String,
    pay_payment: String,
    pending_payment: String,
    transaction_id: String,
    product_vendor_id: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    from_date: Date,
    to_date: Date,
  },
  { timestamps: true }
);
