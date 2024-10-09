import { queryDocument } from "../mysql";
import { errorHandler, getDataFromDB, varifyOwner } from "./common";

export function getFooterPages(req, res) {
  try {
    if (req.query.name) {
      //send single category;
      const sql = `SELECT * FROM footer_pages WHERE name = '${req.query.name}'`;
      getDataFromDB(res, sql);
    } else {
      //send all category
      const sql = "SELECT * FROM footer_pages";
      getDataFromDB(res, sql);
    }
  } catch (error) {
    errorHandler(res, error);
  }
}

export async function updateFooterPages(req, res) {
  try {
    await varifyOwner(req.body.user_id);
    delete req.body.user_id;
    const existsql = `SELECT id FROM footer_pages WHERE name = '${req.query.name}'`;
    const isExist = await queryDocument(existsql);
    const description = req.body.description.replace("'", "&#39;");

    if (isExist.length) {
      const data = `description = '${description}'`;
      const sql = `UPDATE footer_pages SET ${data} WHERE name='${req.query.name}'`;
      await queryDocument(sql);
    } else {
      const sql = `INSERT INTO footer_pages (name, description) VALUES ('${req.query.name}', '${description}')`;
      await queryDocument(sql);
    }
    res.send({ message: `${req.query.name} Updated Successfully` });
  } catch (error) {
    errorHandler(res, error);
  }
}
