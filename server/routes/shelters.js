const express = require('express');
const CowShelter = require('../models/CowShelter');
const WasteListing = require('../models/WasteListing');

const router = express.Router();

const distanceKm = (lat1, lng1, lat2, lng2) => {
  const r = Math.PI / 180;
  const a =
    Math.sin(((lat2 - lat1) * r) / 2) ** 2 +
    Math.cos(lat1 * r) * Math.cos(lat2 * r) * Math.sin(((lng2 - lng1) * r) / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(a));
};

// GET all cow shelters with optional distance calculation and search
router.get('/', async (req, res) => {
  try {
    const { search, lat, lng } = req.query;
    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { place: { $regex: search, $options: 'i' } },
        { district: { $regex: search, $options: 'i' } },
        { acceptableWaste: { $regex: search, $options: 'i' } },
      ];
    }

    const shelters = await CowShelter.find(filter).sort('-createdAt');

    const result = shelters.map((s) => {
      const doc = s.toObject();
      if (lat && lng && s.location && s.location.coordinates) {
        const [sLng, sLat] = s.location.coordinates;
        doc.distance = Number(distanceKm(Number(lat), Number(lng), sLat, sLng).toFixed(1));
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

// POST offer waste to cow shelter
router.post('/offer-waste', async (req, res) => {
  try {
    const { farmerName, phone, place, wasteType, quantityKg, expectedRatePerKg, shelterId, shelterName, isFreeDonation, pickupAddress, notes } = req.body;

    const listing = await WasteListing.create({
      farmerName: farmerName || 'Local Farmer',
      phone: phone || '9876543210',
      place: place || 'Farm Location',
      wasteType: wasteType || 'Vegetable & Greens Residue',
      quantityKg: Number(quantityKg) || 50,
      expectedRatePerKg: Number(expectedRatePerKg) || 0,
      shelterId: shelterId || null,
      shelterName: shelterName || 'Partner Cow Shelter',
      isFreeDonation: Boolean(isFreeDonation),
      pickupAddress: pickupAddress || place || 'Pickup at Farm gate',
      status: 'scheduled',
      notes: notes || 'Scheduled for doorstep pickup',
    });

    res.status(201).json({
      message: 'Waste offer submitted successfully! The cow shelter collection team has received your request.',
      listing,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET all waste listings
router.get('/listings', async (req, res) => {
  try {
    const listings = await WasteListing.find().sort('-createdAt').limit(50);
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
