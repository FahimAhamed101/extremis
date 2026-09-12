const Order = require("../models/Order");

// Generate friendly readable order code
function generateOrderNumber() {
  const randomDigits = Math.floor(10000 + Math.random() * 90000);
  return `SOC-2026-${randomDigits}`;
}

/**
 * POST /api/orders
 * Create new order
 */
async function createOrder(req, res, next) {
  try {
    const {
      items = [],
      billingDetails = {},
      courier = {},
      payment = {},
      pricing = {},
    } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      res.status(400).json({ message: "Order must contain at least one item." });
      return;
    }

    if (!billingDetails.firstName || !billingDetails.email) {
      res.status(400).json({ message: "Billing first name and email are required." });
      return;
    }

    const orderNumber = generateOrderNumber();

    // Calculate subtotal if not provided
    const computedSubtotal = items.reduce(
      (sum, it) => sum + (Number(it.price) || 0) * (Number(it.qty) || 1),
      0
    );

    const subtotal = Number(pricing.subtotal) || computedSubtotal;
    const discount = Number(pricing.discount) || 0;
    const shipping = Number(pricing.shipping) >= 0 ? Number(pricing.shipping) : (Number(courier.cost) || 0);
    const tax = Number(pricing.tax) || 0;
    const grandTotal = Math.max(0, subtotal - discount + shipping + tax);

    const newOrder = await Order.create({
      orderNumber,
      user: req.user ? req.user._id : null,
      items: items.map((it) => ({
        itemId: String(it.id || it.itemId || `item-${Date.now()}`),
        name: String(it.name || "Marketplace Product"),
        price: Number(it.price) || 0,
        qty: Number(it.qty) || 1,
        img: String(it.img || "/images/resources/book3.jpg"),
        type: String(it.type || "product"),
      })),
      billingDetails: {
        firstName: String(billingDetails.firstName || ""),
        lastName: String(billingDetails.lastName || ""),
        email: String(billingDetails.email || ""),
        country: String(billingDetails.country || "United States"),
        state: String(billingDetails.state || ""),
        zipCode: String(billingDetails.zipCode || ""),
        specialNotes: String(billingDetails.specialNotes || ""),
      },
      courier: {
        name: String(courier.name || "FedEx Standard"),
        cost: shipping,
        eta: String(courier.eta || "2-3 business days"),
      },
      payment: {
        method: String(payment.method || "card"),
        status: "paid",
        cardLast4: String(payment.cardLast4 || "4242"),
        cardHolder: String(payment.cardHolder || `${billingDetails.firstName} ${billingDetails.lastName}`.trim()),
        cryptoAddress: String(payment.cryptoAddress || ""),
        transactionRef: `TXN-${Date.now()}`,
      },
      pricing: {
        subtotal: Math.round(subtotal * 100) / 100,
        discount: Math.round(discount * 100) / 100,
        shipping: Math.round(shipping * 100) / 100,
        tax: Math.round(tax * 100) / 100,
        grandTotal: Math.round(grandTotal * 100) / 100,
        couponCode: String(pricing.couponCode || ""),
      },
      status: "completed",
    });

    res.status(201).json({
      ok: true,
      message: "Order placed successfully!",
      order: newOrder,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/orders/:id
 * Retrieve order by ID or orderNumber
 */
async function getOrderById(req, res, next) {
  try {
    const { id } = req.params;
    let order = null;

    if (id.startsWith("SOC-")) {
      order = await Order.findOne({ orderNumber: id });
    } else {
      order = await Order.findById(id).catch(() => null);
    }

    if (!order) {
      res.status(404).json({ message: "Order not found." });
      return;
    }

    res.status(200).json({
      ok: true,
      order,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/orders/my-orders
 * List orders for logged-in user
 */
async function getMyOrders(req, res, next) {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Authentication required." });
      return;
    }

    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({
      ok: true,
      orders,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createOrder,
  getOrderById,
  getMyOrders,
};
