import {
  deleteCategory,
  getCategory,
  postCategory,
  updatetCategory,
} from "../../services/admin/server/category";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      getCategory(req, res);
      break;

    case "POST":
      postCategory(req, res);
      break;

    case "PUT":
      updatetCategory(req, res);
      break;

    case "DELETE":
      deleteCategory(req, res);
      break;

    default:
      res.status(404).send({ message: "not found" });
      break;
  }
}
