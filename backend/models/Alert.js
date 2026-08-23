const mongoose = require("mongoose");

const AlertSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["DROWSY", "YAWN"],
    required: true,
  },
  earValue: Number,
  marValue: Number,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Alert", AlertSchema);