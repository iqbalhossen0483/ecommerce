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

export function getUser(req, res) {
  try {
    if (req.query.id) {
      //send single category;
      const sql = `SELECT * FROM user WHERE id=${req.query.id}`;
      getDataFromDB(res, sql);
    } else if (req.query.home) {
      // send category for home category page;
      const page = parseInt(req.query.page || 0) * req.query.limit;
      const sql = `SELECT * FROM user LIMIT ${page}, ${req.query.limit}`;
      const count = "SELECT COUNT(id) FROM user";
      getDataFromDB(res, sql, count);
    } else if (req.query.filter) {
      const sql = `SELECT * FROM user WHERE user_role = '${req.query.filter}'`;
      getDataFromDB(res, sql);
    } else {
      //send all category
      const sql = "SELECT * FROM user";
      getDataFromDB(res, sql);
    }
  } catch (error) {
    errorHandler(res, error);
  }
}

const UserSchema = Joi.object({
  name: Joi.string().max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  user_role: Joi.string().valid("uploader", "owner").required(),
  profile: Joi.string(),
});

export async function postUser(req, res) {
  try {
    const img = [{ name: "profile", maxCount: 1 }];
    const { error } = await bodyParser(req, res, "assets", img);
    if (error) throw { message: "Error occured when parsing body" };
    await varifyOwner(req.body.user_id);
    delete req.body.user_id;
    //api validateion;
    const varify = UserSchema.validate(req.body);
    if (varify.error) throw { message: varify.error.message };

    //check is user exist;
    const query = `SELECT * FROM user WHERE email='${req.body.email}'`;
    const isExist = await queryDocument(query);
    if (isExist.length) throw { message: "User already exist", status: 409 };
    //no user, you procced;
    //hased password;
    const hashed = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashed;
    if (req.files.profile) {
      req.body.profile = req.files.profile[0].filename;
    } else delete req.body.profile;
    req.body.joined_at = new Date();

    //save to db;
    const sql = "INSERT INTO user SET ";
    const result = await postDocument(sql, req.body);
    if (result.insertId > 0) {
      res.send({ message: "User Added Successfully" });
    } else throw { message: "Unable to Added" };
  } catch (error) {
    if (req.files.profile) {
      deleteImage(req.files.profile[0].filename);
    }
    errorHandler(res, error);
  }
}

export async function deleteUser(req, res) {
  try {
    const { error } = await bodyParser(req, res, "", []);
    if (error) {
      throw { message: "Error occured when parsing body" };
    }
    await varifyOwner(req.body.user_id);
    const sql = `DELETE FROM user WHERE id=${req.body.id}`;
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

export async function updateUser(req, res) {
  try {
    const img = [{ name: "profile", maxCount: 1 }];
    const { error } = await bodyParser(req, res, "assets", img);
    if (error) throw { message: "Error occured when parsing body" };
    await varifyOwner(req.body.user_id);
    delete req.body.user_id;
    if (req.body.password) {
      const hashed = await bcrypt.hash(req.body.password, 10);
      req.body.password = hashed;
    }

    const sql = `UPDATE user SET `;
    const option = `WHERE id=${req.query.id}`;
    const result = await postDocument(sql, req.body, option);
    if (result.changedRows > 0) {
      res.send({ message: "User Updated Successfully" });
    } else throw { message: "Unable to Update" };
  } catch (error) {
    errorHandler(res, error);
  }
}
