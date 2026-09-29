const express = require('express');
const User = require('../models/User');
const Product = require('../models/Product');
const { protect, allowRoles } = require('../middleware/auth');

const router = express.Router();

const distanceKm = (lat1, lng1, lat2, lng2) => {
  const r = Math.PI / 180;
  const a =
    Math.sin(((lat2 - lat1) * r) / 2) ** 2 +
    Math.cos(lat1 * r) * Math.cos(lat2 * r) * Math.sin(((lng2 - lng1) * r) / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(a));
};

// Farmer saves the farm location
router.put('/location', protect, allowRoles('farmer'), async (req, res) => {
  const lat = Number(req.body.lat);
  const lng = Number(req.body.lng);
  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return res.status(400).json({ message: 'Invalid location' });
  }
  await User.findByIdAndUpdate(req.user.id, {
    location: { type: 'Point', coordinates: [lng, lat] },
  });
  res.json({ message: 'Location saved' });
});

// Everyone: farmers on the map, optionally only those near lat/lng within km
router.get('/', async (req, res) => {
  const { lat, lng, km } = req.query;
  const filter = { role: 'farmer', 'location.coordinates.0': { $ne: 0 } };

  if (lat && lng) {
    filter.location = {
      $near: {
        $geometry: { type: 'Point', coordinates: [Number(lng), Number(lat)] },
        $maxDistance: (Number(km) || 25) * 1000,
      },
    };
  }

  const farmers = await User.find(filter).select('name phone location verified').limit(100);
  const ids = farmers.map((f) => f._id);

  const products = await Product.find({
    farmer: { $in: ids },
    isAvailable: true,
    quantity: { $gt: 0 },
  }).select('farmer name');

  const result = farmers.map((f) => {
    const [fLng, fLat] = f.location.coordinates;
    return {
      _id: f._id,
      name: f.name,
      phone: f.phone,
      verified: f.verified,
      lat: fLat,
      lng: fLng,
      products: products.filter((p) => String(p.farmer) === String(f._id)).map((p) => p.name),
      distance: lat && lng ? Number(distanceKm(Number(lat), Number(lng), fLat, fLng).toFixed(1)) : null,
    };
  });

  res.json(result);
});

module.exports = router;
