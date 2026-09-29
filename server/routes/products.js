const express = require('express');
const Product = require('../models/Product');
const upload = require('../middleware/upload');
const { protect, allowRoles } = require('../middleware/auth');

const router = express.Router();

// Buyers: only in-stock, available products (sold-out ones are hidden)
router.get('/', async (req, res) => {
  const { benefit, search, category, juiceOnly } = req.query;
  const filter = { isAvailable: true, quantity: { $gt: 0 } };
  if (benefit) filter.healthBenefits = benefit;
  if (category) filter.category = category;
  if (juiceOnly === 'true') filter.isJuiceSuitable = true;
  if (search) filter.name = { $regex: search, $options: 'i' };

  const products = await Product.find(filter)
    .populate('farmer', 'name phone location')
    .sort('-createdAt');
  res.json(products);
});

// Quick Buy (Fast instant ordering for immediate customer checkout)
router.post('/:id/quick-buy', async (req, res) => {
  const qty = Number(req.body.qty) || 1;
  const { buyerName, buyerPhone, address, paymentMode } = req.body;

  const product = await Product.findOneAndUpdate(
    { _id: req.params.id, isAvailable: true, quantity: { $gte: qty } },
    { $inc: { quantity: -qty } },
    { new: true }
  ).populate('farmer', 'name phone');

  if (!product) return res.status(400).json({ message: 'Not enough stock available' });

  if (product.quantity === 0) {
    product.isAvailable = false;
    await product.save();
  }

  const finalUnitPrice = Math.round(product.price * (1 - (product.discount || 0) / 100));
  const orderTotal = finalUnitPrice * qty;
  const orderId = 'AGRI-' + Math.floor(100000 + Math.random() * 900000);

  res.json({
    success: true,
    message: `Order confirmed! Farmer ${product.farmer?.name || 'Local Farmer'} will dispatch ${qty} ${product.unit} of ${product.name}.`,
    orderId,
    productName: product.name,
    quantity: qty,
    unit: product.unit,
    totalPrice: orderTotal,
    paymentMode: paymentMode || 'Cash on Delivery',
    remainingStock: product.quantity,
  });
});

// Farmer: all of my own products, including sold out
router.get('/mine', protect, allowRoles('farmer'), async (req, res) => {
  res.json(await Product.find({ farmer: req.user.id }).sort('-createdAt'));
});

router.post('/', protect, allowRoles('farmer'), upload.single('image'), async (req, res) => {
  const { name, price, quantity, unit, place, discount, healthBenefits, category } = req.body;
  const qty = Number(quantity);

  const product = await Product.create({
    farmer: req.user.id,
    name, unit, place, category,
    price: Number(price),
    quantity: qty,
    discount: Number(discount) || 0,
    healthBenefits: healthBenefits ? healthBenefits.split(',').filter(Boolean) : [],
    isAvailable: qty > 0,
    image: req.file ? '/uploads/' + req.file.filename : undefined,
  });
  res.status(201).json(product);
});

router.put('/:id', protect, allowRoles('farmer'), async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id, farmer: req.user.id });
  if (!product) return res.status(404).json({ message: 'Product not found' });

  const { price, quantity, discount } = req.body;
  if (price !== undefined) product.price = Number(price);
  if (discount !== undefined) product.discount = Number(discount);
  if (quantity !== undefined) product.quantity = Number(quantity);
  product.isAvailable = product.quantity > 0;
  await product.save();
  res.json(product);
});

router.delete('/:id', protect, allowRoles('farmer'), async (req, res) => {
  const product = await Product.findOneAndDelete({ _id: req.params.id, farmer: req.user.id });
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json({ message: 'Deleted' });
});

// Buy: reduce stock; hide automatically at 0
router.post('/:id/buy', protect, allowRoles('buyer'), async (req, res) => {
  const qty = Number(req.body.qty) || 1;

  const product = await Product.findOneAndUpdate(
    { _id: req.params.id, isAvailable: true, quantity: { $gte: qty } },
    { $inc: { quantity: -qty } },
    { new: true }
  );
  if (!product) return res.status(400).json({ message: 'Not enough stock' });

  if (product.quantity === 0) {
    product.isAvailable = false;
    await product.save();
  }
  res.json({ message: 'Order placed', remaining: product.quantity });
});

module.exports = router;

