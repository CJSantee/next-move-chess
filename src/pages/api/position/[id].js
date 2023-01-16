import dbConnect from "../../../core/dbConnect";
import Position from "../../../lib/models/Position";

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  await dbConnect();

  switch (method) {
    case "PATCH":
      try {
        const position = await Position.findByIdAndUpdate(id, req.body, {
          returnDocument: "after",
        });
        res.status(200).json(position);
      } catch (error) {
        res.status(500).json({ error: "An unexpected error occurred." });
      }
      break;
    default:
      res.status(404).json({ error: "Endpoint not found." });
      break;
  }
}
