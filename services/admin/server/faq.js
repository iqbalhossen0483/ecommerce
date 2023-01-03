import Joi from "joi";
import { postDocument, queryDocument } from "../mysql";
import { errorHandler, getDataFromDB, varifyOwner } from "./common";

export function getFaq(req, res) {
  try {
    if (req.query.id) {
      //send single category;
      const sql = `SELECT * FROM faq WHERE id=${req.query.id}`;
      getDataFromDB(res, sql);
    } else if (req.query.home) {
      // send category for home category page;
      const page = parseInt(req.query.page || 0) * req.query.limit;
      const sql = `SELECT * FROM faq LIMIT ${page}, ${req.query.limit}`;
      const count = "SELECT COUNT(id) FROM faq";
      getDataFromDB(res, sql, count);
    } else {
      //send all category
      const sql = "SELECT * FROM faq";
      getDataFromDB(res, sql);
    }
  } catch (error) {
    errorHandler(res, error);
  }
}

const FaqSchema = Joi.object({
  question: Joi.string().max(400).required(),
  answer: Joi.string().max(600).required(),
});

export async function postFaq(req, res) {
  try {
    await varifyOwner(req.body.user_id);
    delete req.body.user_id;
    //api validateion;
    const varify = FaqSchema.validate(req.body);
    if (varify.error) throw { message: varify.error.message };

    const sql = "INSERT INTO faq SET ";
    const result = await postDocument(sql, req.body);
    if (result.insertId > 0) {
      res.send({ message: "Faq Added Successfully" });
    } else throw { message: "Unable to Added" };
  } catch (error) {
    errorHandler(res, error);
  }
}

export async function deleteFaq(req, res) {
  try {
    await varifyOwner(req.body.user_id);
    const sql = `DELETE FROM faq WHERE id=${req.body.id}`;
    const result = await queryDocument(sql);
    if (result.affectedRows > 0) {
      res.send({ message: "Deleted successfully" });
    } else throw { message: "unable to delete" };
  } catch (error) {
    errorHandler(res, error);
  }
}

export async function updateFaq(req, res) {
  try {
    await varifyOwner(req.body.user_id);
    delete req.body.user_id;
    const sql = `UPDATE faq SET `;
    const option = `WHERE id=${req.query.id}`;
    const result = await postDocument(sql, req.body, option);
    if (result.changedRows > 0) {
      res.send({ message: "Faq Updated Successfully" });
    } else throw { message: "Unable to Update" };
  } catch (error) {
    errorHandler(res, error);
  }
}
