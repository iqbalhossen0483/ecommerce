import {
  getUser,
  loginUser,
  signUpUser,
} from "../../services/admin/server/login";

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      getUser(req, res);
      break;

    case "POST":
      loginUser(req, res);
      break;

    case "PUT":
      signUpUser(req, res);
      break;

    default:
      res.status(404).send({ message: "not found" });
      break;
  }
}
