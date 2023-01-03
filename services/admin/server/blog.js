import Joi from "joi";
import { postDocument, queryDocument } from "../mysql";
import { errorHandler, getDataFromDB, varifyUser } from "./common";

export function getBlog(req, res) {
  try {
    if (req.query.id) {
      //send single category;
      const sql = `SELECT * FROM blog WHERE id=${req.query.id}`;
      getDataFromDB(res, sql);
    } else {
      // send category for home category page;
      const limit = req.query.limit || 10;
      const page = parseInt(req.query.page || 0) * limit;
      let sql = "";
      let count = "";
      if (req.query.user_type === "vendor") {
        sql = `SELECT * FROM blog WHERE user_id = '${req.query.user_id}' AND user_type = '${req.query.user_type}' LIMIT ${page}, ${limit}`;
        count = `SELECT COUNT(id) FROM blog WHERE user_id = '${req.query.user_id}' AND user_type = '${req.query.user_type}'`;
      } else {
        sql = `SELECT * FROM blog LIMIT ${page}, ${limit}`;
        count = "SELECT COUNT(id) FROM blog";
      }
      getDataFromDB(res, sql, count);
    }
  } catch (error) {
    errorHandler(res, error);
  }
}

const FaqSchema = Joi.object({
  title: Joi.string().max(400).required(),
  body: Joi.string().max(600).required(),
  user_id: Joi.number().integer().required(),
  user_type: Joi.string().required(),
  created_at: Joi.date().required(),
  category_id: Joi.number().integer().required(),
  category_name: Joi.string().required(),
  sub_category_id: Joi.number().integer(),
  sub_category_name: Joi.string(),
  pro_sub_id: Joi.number().integer(),
  pro_sub_name: Joi.string(),
});

export async function postBlog(req, res) {
  try {
    await varifyUser(req.body.user_id, req.body.user_type);
    req.body.created_at = new Date();
    //api validateion;
    const varify = FaqSchema.validate(req.body);
    if (varify.error) throw { message: varify.error.message };
    const sql = "INSERT INTO blog SET ";
    const result = await postDocument(sql, req.body);
    if (result.insertId > 0) {
      res.send({ message: "Blog Added Successfully" });
    } else throw { message: "Unable to Added" };
  } catch (error) {
    errorHandler(res, error);
  }
}

export async function deleteBlog(req, res) {
  try {
    await varifyUser(req.body.user_id, req.body.user_type);
    const sql = `DELETE FROM blog WHERE id=${req.body.id}`;
    const result = await queryDocument(sql);
    if (result.affectedRows > 0) {
      res.send({ message: "Deleted successfully" });
    } else throw { message: "unable to delete" };
  } catch (error) {
    errorHandler(res, error);
  }
}

export async function updateBlog(req, res) {
  try {
    await varifyUser(req.body.user_id, req.body.user_type);
    const sql = `UPDATE blog SET `;
    const option = `WHERE id=${req.query.id}`;
    const result = await postDocument(sql, req.body, option);
    if (result.changedRows > 0) {
      res.send({ message: "Blog Updated Successfully" });
    } else throw { message: "Unable to Update" };
  } catch (error) {
    errorHandler(res, error);
  }
}
