import dbConnect from "../../../core/dbConnect";
import Opening from "../../../lib/models/Opening";

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  await dbConnect();

  switch (method) {
    case "PATCH":
      try {
        console.log(req.body);
        const opening = await Opening.findByIdAndUpdate(id, req.body, {
          returnDocument: "after",
        });
        console.log(opening);
        res.status(200).json(opening);
      } catch (error) {
        res.status(500).json({ error: "An unexpected error occurred." });
      }
      break;
    default:
      res.status(404).json({ error: "Endpoint not found." });
      break;
  }
}
