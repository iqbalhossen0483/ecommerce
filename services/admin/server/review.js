import Joi from "joi";
import { postDocument, queryDocument } from "../mysql";
import { errorHandler, getDataFromDB } from "./common";

export function getReview(req, res) {
  // send category for home category page;
  const limit = req.query.limit || 10;
  const page = parseInt(req.query.page || 0) * limit;
  const sql = `SELECT * FROM customer_review LIMIT ${page}, ${limit}`;
  const count = "SELECT COUNT(id) FROM customer_review";
  getDataFromDB(res, sql, count);
}

const PostSchema = Joi.object({
  customer_id: Joi.number().required(),
  product_id: Joi.number().required(),
  customer_name: Joi.string().required(),
  customer_email: Joi.string().email().required(),
  customer_profile: Joi.string(),
  comment: Joi.string().required(),
  rating: Joi.number().max(5),
});

export async function postReview(req, res) {
  try {
    //api validateion;
    const varify = PostSchema.validate(req.body);
    if (varify.error) throw { message: varify.error.message };

    const query = `SELECT id FROM user WHERE id = '${req.body.customer_id}' AND email = '${req.body.customer_email}'`;
    const isUser = await queryDocument(query);
    if (!isUser.length) throw { message: "Forbiden", status: 401 };

    const sql = "INSERT INTO customer_review SET ";
    const result = await postDocument(sql, req.body);
    if (result.insertId > 0) {
      res.send({
        message: "Your Valueable Comment Added Successfully",
      });
    } else throw { message: "Unable to Added" };
  } catch (error) {
    errorHandler(res, error);
  }
}

const DeleteSchema = Joi.object({
  customer_id: Joi.number().required(),
  customer_email: Joi.string().email().required(),
});
export async function deleteReview(req, res) {
  try {
    //api validateion;
    const varify = DeleteSchema.validate(req.body);
    if (varify.error) throw { message: varify.error.message };

    const query = `SELECT id FROM customer_review WHERE customer_id = '${req.body.customer_id}' AND customer_email = '${req.body.customer_email}'`;
    const isUser = await queryDocument(query);
    if (!isUser.length) throw { message: "Forbiden", status: 401 };

    const sql = `DELETE FROM customer_review WHERE id=${req.query.id}`;
    const result = await queryDocument(sql);
    if (result.affectedRows > 0) {
      res.send({ message: "Deleted successfully" });
    } else throw { message: "unable to delete" };
  } catch (error) {
    errorHandler(res, error);
  }
}

export async function updateReview(req, res) {
  try {
    const query = `SELECT id FROM customer_review WHERE id = '${req.query.id}' AND customer_id = '${req.body.customer_id}' AND customer_email = '${req.body.customer_email}'`;
    const isUser = await queryDocument(query);
    if (!isUser.length) throw { message: "Forbiden", status: 401 };
    delete req.body.customer_id;
    delete req.body.customer_email;

    const sql = `UPDATE customer_review SET `;
    const option = `WHERE id=${req.query.id}`;
    const result = await postDocument(sql, req.body, option);
    if (result.changedRows > 0) {
      res.send({ message: "Updated Successfull" });
    } else throw { message: "Unable to Update" };
  } catch (error) {
    errorHandler(res, error);
  }
}
