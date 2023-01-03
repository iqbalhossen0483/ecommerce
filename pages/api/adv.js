import {
  deleteAdv,
  getAdv,
  postAdv,
  updateAdv,
} from "../../services/admin/server/adv";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      getAdv(req, res);
      break;

    case "POST":
      postAdv(req, res);
      break;

    case "PUT":
      updateAdv(req, res);
      break;

    case "DELETE":
      deleteAdv(req, res);
      break;

    default:
      res.status(404).send({ message: "not found" });
      break;
  }
}
