const mongoose = require('mongoose');

const marketplaceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ['uzhavar_sandhai', 'apmc_mandi', 'juice_cluster', 'wholesale_hub'],
      default: 'uzhavar_sandhai',
    },
    place: { type: String, required: true },
    district: { type: String, default: '' },
    operatingHours: { type: String, default: '5:00 AM - 11:30 AM' },
    topCommodities: [String],
    commissionFee: { type: String, default: '0% (Direct Farmer to Consumer)' },
    phone: { type: String, default: '' },
    image: { type: String, required: true },
    dailyArrivalTonnes: { type: Number, default: 25 },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [78.146, 11.664] }, // [lng, lat]
    },
  },
  { timestamps: true }
);

marketplaceSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Marketplace', marketplaceSchema);
