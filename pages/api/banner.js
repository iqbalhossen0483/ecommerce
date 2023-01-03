import {
  deleteBanner,
  getBanner,
  postBanner,
  updateBanner,
} from "../../services/admin/server/banner";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      getBanner(req, res);
      break;

    case "POST":
      postBanner(req, res);
      break;

    case "PUT":
      updateBanner(req, res);
      break;

    case "DELETE":
      deleteBanner(req, res);
      break;

    default:
      res.status(404).send({ message: "not found" });
      break;
  }
}
