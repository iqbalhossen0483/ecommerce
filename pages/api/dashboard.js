import { getDashboardData } from "../../services/admin/server/dashboard";

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      getDashboardData(req, res);
      break;

    default:
      res.status(404).send({ message: "not found" });
      break;
  }
}
