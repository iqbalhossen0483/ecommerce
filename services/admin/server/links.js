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
    let existImage;
    if (req.files.logo) {
      document.push({ name: "logo", info: req.files.logo[0].filename });
      existImage = req.body.deleteImage;
    }
    document.forEach(async (item) => {
      const existsql = `SELECT id FROM important_links WHERE name = '${item.name}'`;
      const exist = await queryDocument(existsql);
      if (exist.length) {
        console.log("exists", exist);

        const updateSql = `UPDATE important_links SET info = '${item.info}' WHERE name = '${item.name}'`;
        await queryDocument(updateSql);
      } else {
        console.log("insert", item);

        const insertSql = `INSERT INTO important_links (name, info) VALUES ('${item.name}', '${item.info}');`;
        await queryDocument(insertSql);
      }
    });
    if (existImage) deleteImage(existImage);
    res.send({ message: "Updated successfully" });
  } catch (error) {
    if (req.files.logo.length) {
      deleteImage(req.files.logo[0].filename);
    }
    errorHandler(res, error);
  }
}
