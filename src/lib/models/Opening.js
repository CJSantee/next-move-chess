const mongoose = require("mongoose");

const MoveSchema = new mongoose.Schema({
  white: {
    type: String,
    required: true,
  },
  black: {
    type: String,
  },
});

const OpeningSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  moves: {
    type: [MoveSchema],
    required: true,
  },
  fen: {
    type: String,
    required: true,
  },
});

export default mongoose.models.Opening ||
  mongoose.model("Opening", OpeningSchema);
