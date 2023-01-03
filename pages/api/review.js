import {
  deleteReview,
  getReview,
  postReview,
  updateReview,
} from "../../services/admin/server/review";

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      getReview(req, res);
      break;

    case "POST":
      postReview(req, res);
      break;

    case "PUT":
      updateReview(req, res);
      break;

    case "DELETE":
      deleteReview(req, res);
      break;

    default:
      res.status(404).send({ message: "not found" });
      break;
  }
}
