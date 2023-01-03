import {
  deletesubCategory,
  getSubcategory,
  postSubCategory,
  updateSubtCategory,
} from "../../services/admin/server/subcategory";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      getSubcategory(req, res);
      break;

    case "POST":
      postSubCategory(req, res);
      break;

    case "PUT":
      updateSubtCategory(req, res);
      break;

    case "DELETE":
      deletesubCategory(req, res);
      break;

    default:
      res.status(404).send({ message: "not found" });
      break;
  }
}
