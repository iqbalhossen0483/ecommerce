import {
  deleteOffer,
  getOffer,
  postOffer,
  updateOffer,
} from "../../services/admin/server/offer";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      getOffer(req, res);
      break;

    case "POST":
      postOffer(req, res);
      break;

    case "PUT":
      updateOffer(req, res);
      break;

    case "DELETE":
      deleteOffer(req, res);
      break;

    default:
      res.status(404).send({ message: "not found" });
      break;
  }
}
