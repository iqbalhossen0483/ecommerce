import {
  deleteOrder,
  getOder,
  postOrder,
  updateOrder,
} from "../../services/admin/server/order";

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      getOder(req, res);
      break;

    case "POST":
      postOrder(req, res);
      break;

    case "PUT":
      updateOrder(req, res);
      break;

    case "DELETE":
      deleteOrder(req, res);
      break;

    default:
      res.status(404).send({ message: "not found" });
      break;
  }
}
