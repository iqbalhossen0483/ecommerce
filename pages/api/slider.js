import {
  deleteSlider,
  getSlider,
  postSlider,
  updateSlider,
} from "../../services/admin/server/slider";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      getSlider(req, res);
      break;

    case "POST":
      postSlider(req, res);
      break;

    case "PUT":
      updateSlider(req, res);
      break;

    case "DELETE":
      deleteSlider(req, res);
      break;

    default:
      res.status(404).send({ message: "not found" });
      break;
  }
}
