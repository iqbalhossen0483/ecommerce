export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      // getNews(req, res, news);
      break;

    case "POST":
      // postNews(req, res, news);
      break;

    case "PUT":
      // updateNews(req, res, news);
      break;

    case "DELETE":
      // deleteNews(req, res, news);
      break;

    default:
      res.status(404).send({ message: "not found" });
      break;
  }
}
