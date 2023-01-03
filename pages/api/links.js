import { getLinks, updateLinks } from "../../services/admin/server/links";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      getLinks(req, res);
      break;

    case "PUT":
      updateLinks(req, res);
      break;

    default:
      res.status(404).send({ message: "not found" });
      break;
  }
}
