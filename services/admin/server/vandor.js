import bcrypt from "bcryptjs";
import Joi from "joi";
import { postDocument, queryDocument } from "../mysql";
import {
  bodyParser,
  deleteImage,
  errorHandler,
  getDataFromDB,
  varifyOwner,
} from "./common";

export function getVandor(req, res) {
  try {
    if (req.query.id) {
      //send single category;
      const sql = `SELECT * FROM vandor WHERE id=${req.query.id}`;
      getDataFromDB(res, sql);
    } else if (req.query.home) {
      // send category for home category page;
      const page = parseInt(req.query.page || 0) * req.query.limit;
      const sql = `SELECT * FROM vandor LIMIT ${page}, ${req.query.limit}`;
      const count = "SELECT COUNT(id) FROM vandor";
      getDataFromDB(res, sql, count);
    } else {
      //send all vandor
      const sql = "SELECT * FROM vandor";
      getDataFromDB(res, sql);
    }
  } catch (error) {
    errorHandler(res, error);
  }
}

const VandorSchema = Joi.object({
  name: Joi.string().max(100).required(),
  email: Joi.string().email().required(),
  number: Joi.string().required(),
  shop_name: Joi.string().max(100).required(),
  trad_liecence: Joi.number(),
  shop_location: Joi.string().required(),
  password: Joi.string().min(6).required(),
  shop_logo: Joi.string(),
  joined_at: Joi.date().required(),
});

export async function postVandor(req, res) {
  try {
    const img = [{ name: "shop_logo", maxCount: 1 }];
    const { error } = await bodyParser(req, res, "assets", img);
    if (error) {
      throw { message: "Error occured when image updlading" };
    }

    await varifyOwner(req.body.user_id);
    delete req.body.user_id;

    //check is user exist;
    const query = `SELECT * FROM vandor WHERE email='${req.body.email}'`;
    const isExist = await queryDocument(query);
    if (isExist.length) throw { message: "Vandor already exist" };

    //no user, you procced;
    //api validateion;
    const varify = VandorSchema.validate(req.body);
    if (varify.error) throw { message: varify.error.message };
    //hase password;
    const hashed = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashed;
    if (req.files?.shop_logo) {
      req.body.shop_logo = req.files.shop_logo[0].filename;
    } else delete req.body.shop_logo;

    //save to db;
    const sql = "INSERT INTO vandor SET ";
    const result = await postDocument(sql, req.body);
    if (result.insertId > 0) {
      res.send({ message: "Vandor Added Successfully" });
    } else throw { message: "Unable to Added" };
  } catch (error) {
    if (req.files?.shop_logo) {
      deleteImage(req.files.shop_logo[0].filename);
    }
    errorHandler(res, error);
  }
}

export async function deleteVandor(req, res) {
  try {
    const { error } = await bodyParser(req, res, "", []);
    if (error) throw { message: "Error occured when parsing body" };
    await varifyOwner(req.body.user_id);
    delete req.body.user_id;

    const sql = `DELETE FROM vandor WHERE id=${req.body.id}`;
    const result = await queryDocument(sql);
    if (result.affectedRows > 0) {
      if (req.body.image) {
        deleteImage(req.body.image);
      }
      res.send({ message: "Deleted successfully" });
    } else throw { message: "unable to delete" };
  } catch (error) {
    errorHandler(res, error);
  }
}

export async function updateVandor(req, res) {
  try {
    const img = [{ name: "shop_logo", maxCount: 1 }];
    const { error } = await bodyParser(req, res, "assets", img);
    if (error) throw { message: "Error occured when parsing body" };
    await varifyOwner(req.body.user_id);
    delete req.body.user_id;
    if (req.body.password) {
      const hashed = await bcrypt.hash(req.body.password, 10);
      req.body.password = hashed;
    }
    let existImage;
    if (req.files?.shop_logo) {
      req.body.shop_logo = req.files.shop_logo[0].filename;
      existImage = req.body.deleteImage;
      delete req.body.deleteImage;
    } else delete req.body.shop_logo;

    const sql = `UPDATE vandor SET `;
    const option = `WHERE id=${req.query.id}`;
    if (!Object.keys(req.body).length) {
      throw { message: "No update found" };
    }

    const result = await postDocument(sql, req.body, option);
    if (result.changedRows > 0) {
      if (existImage) deleteImage(existImage);
      res.send({ message: "Vandor Updated Successfully" });
    } else throw { message: "Unable to Update, please try again" };
  } catch (error) {
    errorHandler(res, error);
  }
}
