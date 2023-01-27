import dbConnect from "../../core/dbConnect";
import Opening from "../../lib/models/Opening";

const filter = { __v: 0 };

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const openings = await Opening.find(req.query, filter);
        res.status(200).json(openings);
      } catch (error) {
        res.status(500).json({ error: "An unexpected error occurred." });
      }
      break;
    case "POST":
      try {
        const opening = await Opening.create(req.body);
        res.status(201).json(opening);
      } catch (error) {
        res.status(400).json({ error: "An unexpected error occurred." });
      }
    default:
      res.status(404).json({ error: "Endpoint not found." });
      break;
  }
}
