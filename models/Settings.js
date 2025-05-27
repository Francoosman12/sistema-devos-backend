const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema({
  autoGenerateSKU: { type: Boolean, default: true }, // 📌 Controla si el SKU es automático o manual
});

module.exports = mongoose.model("Settings", settingsSchema);