import mongoose from "mongoose";

const PositionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  piece_placement: {
    type: String,
    required: true,
  },
  active_color: {
    type: String,
    required: true,
  },
  book_moves: {
    type: [String],
  },
});

export default mongoose.models.Position ||
  mongoose.model("Position", PositionSchema);
