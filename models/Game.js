const mongoose = require("mongoose");

const TagSchema = new mongoose.Schema({
  event: {
    type: String,
    required: true,
  },
  site: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  round: {
    type: String,
    required: true,
  },
  white: {
    type: String,
    required: true,
  },
  black: {
    type: String,
    required: true,
  },
  result: {
    type: String,
    required: true,
  },
});

const MoveSchema = new mongoose.Schema({
  white: {
    type: String,
  },
  black: {
    type: String,
  },
});

const GameSchema = new mongoose.Schema({
  tags: {
    type: TagSchema,
    required: true,
  },
  moves: {
    type: [MoveSchema],
    required: true,
  },
});

module.exports = Game = mongoose.model("game", GameSchema);
