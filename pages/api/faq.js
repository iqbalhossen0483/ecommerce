import {
  deleteFaq,
  getFaq,
  postFaq,
  updateFaq,
} from "../../services/admin/server/faq";

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      getFaq(req, res);
      break;
    case "POST":
      postFaq(req, res);
      break;

    case "PUT":
      updateFaq(req, res);
      break;

    case "DELETE":
      deleteFaq(req, res);
      break;

    default:
      res.status(404).send({ message: "not found" });
      break;
  }
}
