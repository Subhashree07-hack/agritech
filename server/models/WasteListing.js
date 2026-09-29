const mongoose = require('mongoose');

const wasteListingSchema = new mongoose.Schema(
  {
    farmerName: { type: String, required: true },
    phone: { type: String, required: true },
    place: { type: String, required: true },
    wasteType: { type: String, required: true }, // e.g. "Leafy Greens Trimmings", "Tomato/Veg Discards", "Fruit Pulp"
    quantityKg: { type: Number, required: true },
    expectedRatePerKg: { type: Number, default: 0 },
    shelterId: { type: mongoose.Schema.Types.ObjectId, ref: 'CowShelter' },
    shelterName: { type: String, default: '' },
    isFreeDonation: { type: Boolean, default: false },
    pickupAddress: { type: String, required: true },
    status: { type: String, enum: ['open', 'matched', 'scheduled', 'collected'], default: 'open' },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('WasteListing', wasteListingSchema);
