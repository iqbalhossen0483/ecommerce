import {
  deleteUser,
  getUser,
  postUser,
  updateUser,
} from "../../services/admin/server/user";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      getUser(req, res);
      break;

    case "POST":
      postUser(req, res);
      break;

    case "PUT":
      updateUser(req, res);
      break;

    case "DELETE":
      deleteUser(req, res);
      break;

    default:
      res.status(404).send({ message: "not found" });
      break;
  }
}
