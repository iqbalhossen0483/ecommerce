import {
  deleteCoupon,
  getCoupon,
  postCoupon,
  updateCoupon,
} from "../../services/admin/server/coupon";

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      getCoupon(req, res);
      break;

    case "POST":
      postCoupon(req, res);
      break;

    case "PUT":
      updateCoupon(req, res);
      break;

    case "DELETE":
      deleteCoupon(req, res);
      break;

    default:
      res.status(404).send({ message: "not found" });
      break;
  }
}
