import {
  deleteProduct,
  getProduct,
  postProduct,
  updateProduct,
} from "../../services/admin/server/product";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      getProduct(req, res);
      break;

    case "POST":
      postProduct(req, res);
      break;

    case "PUT":
      updateProduct(req, res);
      break;

    case "DELETE":
      deleteProduct(req, res);
      break;

    default:
      res.status(404).send({ message: "not found" });
      break;
  }
}
