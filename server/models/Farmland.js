const mongoose = require('mongoose');

const farmlandSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    ownerName: { type: String, required: true },
    phone: { type: String, required: true },
    place: { type: String, required: true },
    district: { type: String, default: '' },
    totalAcres: { type: Number, required: true },
    availableAcres: { type: Number, required: true },
    soilType: { type: String, default: 'Red Loamy Fertile Soil' },
    waterSource: { type: String, default: 'Borewell & Canal Drip System' },
    cropsSuitable: [String], // e.g. ['Tomato', 'Spinach', 'Banana', 'Papaya']
    contractType: { type: String, default: 'Seasonal Buyback Contract' },
    ratePerAcre: { type: Number, required: true },
    contractPeriod: { type: String, default: '6 to 12 Months' },
    image: { type: String, required: true },
    description: { type: String, default: '' },
    organicCertified: { type: Boolean, default: true },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [78.146, 11.664] }, // [lng, lat]
    },
  },
  { timestamps: true }
);

farmlandSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Farmland', farmlandSchema);
