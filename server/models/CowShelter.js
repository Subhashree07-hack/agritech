const mongoose = require('mongoose');

const cowShelterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    place: { type: String, required: true },
    district: { type: String, default: '' },
    contactPerson: { type: String, default: '' },
    phone: { type: String, required: true },
    image: { type: String, required: true },
    capacity: { type: String, default: '200+ Native Cows' },
    cowCount: { type: Number, default: 250 },
    dailyNeedKg: { type: Number, default: 1000 },
    currentStockKg: { type: Number, default: 350 },
    acceptableWaste: [String],
    buyRatePerKg: { type: Number, default: 4.5 },
    freePickupMinKg: { type: Number, default: 80 },
    description: { type: String, default: '' },
    verified: { type: Boolean, default: true },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [78.146, 11.664] }, // [lng, lat]
    },
  },
  { timestamps: true }
);

cowShelterSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('CowShelter', cowShelterSchema);
