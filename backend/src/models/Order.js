const mongoose = require("mongoose");

const OrderItemSchema = new mongoose.Schema(
  {
    itemId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    qty: { type: Number, default: 1 },
    img: { type: String, default: "/images/resources/book3.jpg" },
    type: { type: String, default: "product" },
  },
  { _id: false }
);

const BillingDetailsSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    country: { type: String, default: "United States" },
    state: { type: String, default: "" },
    zipCode: { type: String, default: "" },
    specialNotes: { type: String, default: "" },
  },
  { _id: false }
);

const CourierSchema = new mongoose.Schema(
  {
    name: { type: String, default: "FedEx Standard" },
    cost: { type: Number, default: 8.0 },
    eta: { type: String, default: "2-3 business days" },
  },
  { _id: false }
);

const PaymentSchema = new mongoose.Schema(
  {
    method: { type: String, default: "card" }, // 'card' | 'paypal' | 'bitcoin' | 'wallet'
    status: { type: String, enum: ["paid", "pending", "failed"], default: "paid" },
    cardLast4: { type: String, default: "4242" },
    cardHolder: { type: String, default: "" },
    cryptoAddress: { type: String, default: "" },
    transactionRef: { type: String, default: "" },
  },
  { _id: false }
);

const PricingSchema = new mongoose.Schema(
  {
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    shipping: { type: Number, default: 8.0 },
    tax: { type: Number, default: 0 },
    grandTotal: { type: Number, required: true },
    couponCode: { type: String, default: "" },
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    items: [OrderItemSchema],
    billingDetails: BillingDetailsSchema,
    courier: CourierSchema,
    payment: PaymentSchema,
    pricing: PricingSchema,
    status: {
      type: String,
      enum: ["processing", "completed", "shipped", "cancelled"],
      default: "completed",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", OrderSchema);
