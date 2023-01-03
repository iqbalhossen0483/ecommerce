import { queryDocument } from "../mysql";
import {
  bodyParser,
  deleteImage,
  errorHandler,
  getDataFromDB,
  varifyOwner,
} from "./common";

export function getLinks(req, res) {
  try {
    const sql = "SELECT * FROM important_links";
    getDataFromDB(res, sql);
  } catch (error) {
    errorHandler(res, error);
  }
}

export async function updateLinks(req, res) {
  try {
    const img = [{ name: "logo", maxCount: 1 }];
    const { error } = await bodyParser(req, res, "assets", img);
    if (error) throw { message: "Error occured when parsing body" };

    const document = JSON.parse(req.body.document);
    await varifyOwner(req.body.user_id);
    delete req.body.user_id;
    let exist;
    if (req.files.logo) {
      document.push({ name: "logo", info: req.files.logo[0].filename });
      exist = req.body.exist;
    }
    document.forEach(async (item) => {
      const sql = `UPDATE important_links SET info = "${item.info}" WHERE name = "${item.name}"`;
      await queryDocument(sql);
    });
    if (exist) deleteImage(exist);
    res.send({ message: "Updated successfully" });
  } catch (error) {
    if (req.files.logo.length) {
      deleteImage(req.files.logo[0].filename);
    }
    errorHandler(res, error);
  }
}
