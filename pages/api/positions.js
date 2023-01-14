import Position from "../../models/Position";
// const { fenToPosition } = require("../utils/positions");
// const { Chess } = require("chess.js");

const filter = { __v: 0 };

// const getAllPositions = async () => {
//   return await Position.find({}, filter);
// };

// const getByPosition = async ({ piece_placement, active_color }) => {
//   return await Position.find({ piece_placement, active_color }, filter);
// };

// const getRandomAfterBookMove = async (fen, book_moves) => {
//   const game = new Chess();
//   game.load(fen);
//   const move = book_moves[Math.floor(Math.random() * book_moves.length)];
//   game.move(move);
//   const [position] = await getByPosition(fenToPosition(game.fen()));
//   if (!position) {
//     throw new Error(`Book move ${move} does not have a matching position.`);
//   }
//   return {
//     position,
//     move,
//   };
// };

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const positions = await Position.find({}, filter);
        res.status(200).json({ success: true, data: positions });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      try {
        const position = await Position.create(req.body);
        res.status(201).json({ success: true, data: position });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(404).json({ success: false });
      break;
  }
}
