const express = require('express');
const Farmland = require('../models/Farmland');

const router = express.Router();

const distanceKm = (lat1, lng1, lat2, lng2) => {
  const r = Math.PI / 180;
  const a =
    Math.sin(((lat2 - lat1) * r) / 2) ** 2 +
    Math.cos(lat1 * r) * Math.cos(lat2 * r) * Math.sin(((lng2 - lng1) * r) / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(a));
};

// GET farmlands with optional search by location or crop
router.get('/', async (req, res) => {
  try {
    const { search, crop, lat, lng } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { place: { $regex: search, $options: 'i' } },
        { district: { $regex: search, $options: 'i' } },
        { cropsSuitable: { $regex: search, $options: 'i' } },
        { soilType: { $regex: search, $options: 'i' } },
      ];
    }

    if (crop) {
      filter.cropsSuitable = { $regex: crop, $options: 'i' };
    }

    const farmlands = await Farmland.find(filter).sort('-createdAt');

    const result = farmlands.map((f) => {
      const doc = f.toObject();
      if (lat && lng && f.location && f.location.coordinates) {
        const [fLng, fLat] = f.location.coordinates;
        doc.distance = Number(distanceKm(Number(lat), Number(lng), fLat, fLng).toFixed(1));
      } else {
        doc.distance = null;
      }
      return doc;
    });

    if (lat && lng) {
      result.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST contract inquiry
router.post('/inquire', async (req, res) => {
  try {
    const { farmlandId, buyerName, buyerPhone, requestedAcres, cropPlan, message } = req.body;
    res.json({
      message: 'Contract farming inquiry sent successfully! The farmland owner will contact you within 24 hours.',
      inquiry: {
        farmlandId,
        buyerName,
        buyerPhone,
        requestedAcres,
        cropPlan,
        message,
        date: new Date(),
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
