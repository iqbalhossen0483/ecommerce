import Joi from "joi";
import { postDocument, queryDocument } from "../mysql";
import { errorHandler, getDataFromDB, varifyOwner } from "./common";

export function getProSub(req, res) {
  try {
    if (req.query.id) {
      //send single category;
      const sql = `SELECT * FROM pro_sub_category WHERE id=${req.query.id}`;
      getDataFromDB(res, sql);
    } else if (req.query.home) {
      // send category for home category page;
      const page = parseInt(req.query.page || 0) * req.query.limit;
      const sql = `SELECT * FROM pro_sub_category LIMIT ${page}, ${req.query.limit}`;
      const count = "SELECT COUNT(id) FROM pro_sub_category";
      getDataFromDB(res, sql, count);
    } else {
      //send all category
      const sql = "SELECT * FROM pro_sub_category";
      getDataFromDB(res, sql);
    }
  } catch (error) {
    errorHandler(res, error);
  }
}

const prosubSchema = Joi.object({
  name: Joi.string().required(),
  sub_category_id: Joi.number().integer().required(),
  sub_category_name: Joi.string().required(),
});

export async function postProSub(req, res) {
  try {
    if (!req.body.user_id) {
      throw { message: "Forbiden", status: 403 };
    }
    delete req.body.user_id;
    //api validateion;
    const varify = prosubSchema.validate(req.body);
    if (varify.error) throw { message: varify.error.message };

    const query = `SELECT id FROM pro_sub_category WHERE name = '${req.body.name}' AND sub_category_id = '${req.body.sub_category_id}'`;
    const isExist = await queryDocument(query);
    if (isExist.length) throw { message: "Already added", status: 409 };

    const sql = "INSERT INTO pro_sub_category SET ";
    const result = await postDocument(sql, req.body);
    if (result.insertId > 0) {
      res.send({ message: "Pro Sub Category Added Successfully" });
    } else throw { message: "Unable to Added" };
  } catch (error) {
    errorHandler(res, error);
  }
}

export async function deleteProsub(req, res) {
  try {
    await varifyOwner(req.body.user_id);
    const sql = `DELETE FROM pro_sub_category WHERE id=${req.body.id}`;
    const result = await queryDocument(sql);
    if (result.affectedRows > 0) {
      res.send({ message: "Deleted successfully" });
    } else throw { message: "unable to delete" };
  } catch (error) {
    errorHandler(res, error);
  }
}

export async function updatetProsub(req, res) {
  try {
    await varifyOwner(req.body.user_id);
    delete req.body.user_id;
    const sql = `UPDATE pro_sub_category SET `;
    const option = `WHERE id=${req.query.id}`;
    const result = await postDocument(sql, req.body, option);
    if (result.changedRows > 0) {
      res.send({ message: "Pro Sub Category Updated Successfully" });
    } else throw { message: "Unable to Update" };
  } catch (error) {
    errorHandler(res, error);
  }
}
