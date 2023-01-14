const mongoose = require("mongoose");

const MoveSchema = new mongoose.Schema({
  white: {
    type: String,
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
});

module.exports = Opening = mongoose.model("opening", OpeningSchema);
