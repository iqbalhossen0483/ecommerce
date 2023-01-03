import {
  deleteBlog,
  getBlog,
  postBlog,
  updateBlog,
} from "../../services/admin/server/blog";

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      getBlog(req, res);
      break;
    case "POST":
      postBlog(req, res);
      break;

    case "PUT":
      updateBlog(req, res);
      break;

    case "DELETE":
      deleteBlog(req, res);
      break;

    default:
      res.status(404).send({ message: "not found" });
      break;
  }
}
