const express = require('express');
const Product = require('../models/Product');

const router = express.Router();

const JUICE_PARTNERS = [
  {
    id: 'jp1',
    name: 'Green Sip Fresh Juice Bar',
    place: 'Town Hall Circle, Salem',
    phone: '+91 94432 18920',
    dailyDemandKg: 180,
    acceptedFruits: ['Oranges', 'Pineapple', 'Watermelon', 'Papaya', 'Lemon'],
    rateMultiplier: 0.65, // 35% wholesale juice rate
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'jp2',
    name: 'Nectar Pure Juices & Smoothies',
    place: 'RS Puram, Coimbatore',
    phone: '+91 98941 77312',
    dailyDemandKg: 300,
    acceptedFruits: ['Banana', 'Papaya', 'Orange', 'Pomegranate', 'Guava'],
    rateMultiplier: 0.70,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'jp3',
    name: 'Tropical Pulp Express & Cold Pressed',
    place: 'Bypass Road, Madurai',
    phone: '+91 97892 44109',
    dailyDemandKg: 450,
    acceptedFruits: ['Pineapple', 'Watermelon', 'Sweet Lime', 'Mango'],
    rateMultiplier: 0.60,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'jp4',
    name: 'Juice Crush & Shake Junction',
    place: 'Cumbum Valley, Theni',
    phone: '+91 94863 55214',
    dailyDemandKg: 200,
    acceptedFruits: ['Banana', 'Guava', 'Papaya', 'Citrus Lime'],
    rateMultiplier: 0.68,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&auto=format&fit=crop&q=80',
  },
];

// GET juice shop partners
router.get('/partners', (req, res) => {
  res.json(JUICE_PARTNERS);
});

// POST dispatch fruit batch directly to juice shop
router.post('/dispatch', async (req, res) => {
  try {
    const { productId, fruitName, quantityKg, shopId, shopName, farmerName, farmerPhone, pickupPlace } = req.body;

    let product = null;
    if (productId) {
      product = await Product.findById(productId);
      if (product && product.quantity >= Number(quantityKg)) {
        product.quantity -= Number(quantityKg);
        if (product.quantity <= 0) {
          product.isAvailable = false;
        }
        await product.save();
      }
    }

    res.json({
      success: true,
      message: `Direct dispatch created! ${quantityKg} kg of ${fruitName || 'fresh fruit'} has been allocated to ${shopName || 'Partner Juice Bar'}. Driver pickup assigned.`,
      dispatchId: 'JDX-' + Math.floor(100000 + Math.random() * 900000),
      allocatedKg: Number(quantityKg),
      remainingStock: product ? product.quantity : null,
      status: 'Pickup Dispatched',
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
