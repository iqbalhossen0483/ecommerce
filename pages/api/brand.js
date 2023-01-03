import {
  deleteBrand,
  getBrand,
  postBrand,
  updatetCategory,
} from "../../services/admin/server/brand";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      getBrand(req, res);
      break;

    case "POST":
      postBrand(req, res);
      break;

    case "PUT":
      updatetCategory(req, res);
      break;

    case "DELETE":
      deleteBrand(req, res);
      break;

    default:
      res.status(404).send({ message: "not found" });
      break;
  }
}
