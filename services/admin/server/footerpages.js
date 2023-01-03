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
    const description = req.body.description.replace("'", "&#39;");
    const data = `description = '${description}'`;
    const sql = `UPDATE footer_pages SET ${data} WHERE name='${req.query.name}'`;
    const result = await queryDocument(sql);
    if (result.changedRows > 0) {
      res.send({ message: `${req.query.name} Updated Successfully` });
    } else throw { message: "No Update found" };
  } catch (error) {
    errorHandler(res, error);
  }
}
