import {
  deleteProsub,
  getProSub,
  postProSub,
  updatetProsub,
} from "../../services/admin/server/prosub";

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      getProSub(req, res);
      break;

    case "POST":
      postProSub(req, res);
      break;

    case "PUT":
      updatetProsub(req, res);
      break;

    case "DELETE":
      deleteProsub(req, res);
      break;

    default:
      res.status(404).send({ message: "not found" });
      break;
  }
}
