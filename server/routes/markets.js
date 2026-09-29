const express = require('express');
const Marketplace = require('../models/Marketplace');

const router = express.Router();

const distanceKm = (lat1, lng1, lat2, lng2) => {
  const r = Math.PI / 180;
  const a =
    Math.sin(((lat2 - lat1) * r) / 2) ** 2 +
    Math.cos(lat1 * r) * Math.cos(lat2 * r) * Math.sin(((lng2 - lng1) * r) / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(a));
};

// GET markets / mandis with location search
router.get('/', async (req, res) => {
  try {
    const { search, type, lat, lng } = req.query;
    const filter = {};

    if (type) filter.type = type;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { place: { $regex: search, $options: 'i' } },
        { district: { $regex: search, $options: 'i' } },
        { topCommodities: { $regex: search, $options: 'i' } },
      ];
    }

    const markets = await Marketplace.find(filter);

    const result = markets.map((m) => {
      const doc = m.toObject();
      if (lat && lng && m.location && m.location.coordinates) {
        const [mLng, mLat] = m.location.coordinates;
        doc.distance = Number(distanceKm(Number(lat), Number(lng), mLat, mLng).toFixed(1));
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

module.exports = router;
