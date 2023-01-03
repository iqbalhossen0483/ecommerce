import {
  deleteVandor,
  getVandor,
  postVandor,
  updateVandor,
} from "../../services/admin/server/vandor";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      getVandor(req, res);
      break;

    case "POST":
      postVandor(req, res);
      break;

    case "PUT":
      updateVandor(req, res);
      break;

    case "DELETE":
      deleteVandor(req, res);
      break;

    default:
      res.status(404).send({ message: "not found" });
      break;
  }
}
