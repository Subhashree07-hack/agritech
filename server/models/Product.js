const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 0 },
    unit: { type: String, default: 'kg' },
    category: { type: String, enum: ['vegetable', 'greens', 'fruit'], default: 'vegetable' },
    image: String,
    place: { type: String, default: '' },
    healthBenefits: [String],
    discount: { type: Number, default: 0, min: 0, max: 90 },
    isAvailable: { type: Boolean, default: true },
    isJuiceSuitable: { type: Boolean, default: false },
    juicePrice: { type: Number, default: 0 },
    healthNote: { type: String, default: '' },
    harvestTime: { type: String, default: 'Harvested Today' },
    rating: { type: Number, default: 4.8 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
