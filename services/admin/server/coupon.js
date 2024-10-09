import Joi from "joi";
import { postDocument, queryDocument } from "../mysql";
import { errorHandler, getDataFromDB, varifyUser } from "./common";

export function getCoupon(req, res) {
  try {
    if (req.query.id) {
      //send single category;
      const sql = `SELECT * FROM coupon WHERE id=${req.query.id}`;
      getDataFromDB(res, sql);
    } else {
      // send category for home category page;
      const limit = req.query.limit || 10;
      const page = parseInt(req.query.page || 0) * limit;
      let sql = "";
      let count = "";
      if (req.query.user_type === "vendor") {
        sql = `SELECT * FROM coupon WHERE user_id = '${req.query.user_id}' AND user_type = '${req.query.user_type}' LIMIT ${page}, ${limit}`;
        count = `SELECT COUNT(id) FROM coupon WHERE user_id = '${req.query.user_id}' AND user_type = '${req.query.user_type}'`;
      } else {
        sql = `SELECT * FROM coupon LIMIT ${page}, ${limit}`;
        count = "SELECT COUNT(id) FROM coupon";
      }
      getDataFromDB(res, sql, count);
    }
  } catch (error) {
    errorHandler(res, error);
  }
}

const CouponSchema = Joi.object({
  code: Joi.string().max(50).required(),
  amount: Joi.number().required(),
  type: Joi.string().required(),
  store_id: Joi.number().integer(),
  validate_for: Joi.date().required(),
  started_at: Joi.date().required(),
});

export async function postCoupon(req, res) {
  try {
    await varifyUser(req.body.user_id, req.body.user_type);
    delete req.body.user_id;
    delete req.body.user_type;
    //api validateion;
    const varify = CouponSchema.validate(req.body);
    if (varify.error) throw { message: varify.error.message };
    const query = `SELECT id FROM coupon WHERE code = '${req.body.code}'`;
    const isExist = await queryDocument(query);
    if (isExist.length) {
      throw { message: "Already exist" };
    }
    const sql = "INSERT INTO coupon SET ";
    const result = await postDocument(sql, req.body);
    if (result.insertId > 0) {
      res.send({ message: "Coupon Added Successfully" });
    } else throw { message: "Unable to Added" };
  } catch (error) {
    console.log(error);

    errorHandler(res, error);
  }
}

export async function deleteCoupon(req, res) {
  try {
    await varifyUser(req.query.user, req.query.user_type);
    delete req.query.user;
    const sql = `DELETE FROM coupon WHERE id=${req.query.id}`;
    const result = await queryDocument(sql);
    if (result.affectedRows > 0) {
      res.send({ message: "Deleted successfully" });
    } else throw { message: "unable to delete" };
  } catch (error) {
    errorHandler(res, error);
  }
}

export async function updateCoupon(req, res) {
  try {
    await varifyUser(req.body.user_id, req.body.user_type);
    const sql = `UPDATE coupon SET `;
    const option = `WHERE id=${req.query.id}`;
    const result = await postDocument(sql, req.body, option);
    if (result.changedRows > 0) {
      res.send({ message: "Coupon Updated Successfully" });
    } else throw { message: "Unable to Update" };
  } catch (error) {
    errorHandler(res, error);
  }
}
