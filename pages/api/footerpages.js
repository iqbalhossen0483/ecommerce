import {
  getFooterPages,
  updateFooterPages,
} from "../../services/admin/server/footerpages";

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      getFooterPages(req, res);
      break;

    case "PUT":
      updateFooterPages(req, res);
      break;

    default:
      res.status(404).send({ message: "not found" });
      break;
  }
}
