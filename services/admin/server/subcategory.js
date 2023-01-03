import Joi from "joi";
import { postDocument, queryDocument } from "../mysql";
import {
  bodyParser,
  deleteImage,
  errorHandler,
  getDataFromDB,
  varifyOwner,
} from "./common";

export function getSubcategory(req, res) {
  try {
    if (req.query.id) {
      //send single category;
      const sql = `SELECT * FROM sub_category WHERE id=${req.query.id}`;
      getDataFromDB(res, sql);
    } else if (req.query.home) {
      // send category for home category page;
      const page = parseInt(req.query.page || 0) * req.query.limit;
      const sql = `SELECT * FROM sub_category LIMIT ${page}, ${req.query.limit}`;
      const count = "SELECT COUNT(id) FROM sub_category";
      getDataFromDB(res, sql, count);
    } else {
      //send all category
      const sql = "SELECT * FROM sub_category";
      getDataFromDB(res, sql);
    }
  } catch (error) {
    errorHandler(res, error);
  }
}

const subCategorySchema = Joi.object({
  name: Joi.string().required(),
  category_id: Joi.number().integer().required(),
  category_name: Joi.string().required(),
  description: Joi.string().max(500),
  image: Joi.string().required(),
});

export async function postSubCategory(req, res) {
  try {
    const img = [{ name: "image", maxCount: 1 }];
    const { error } = await bodyParser(req, res, "assets", img);
    if (error || !req.files.image) {
      throw { message: "Error occured when image updlading" };
    }
    req.body.image = req.files.image[0].filename;

    await varifyOwner(req.body.user_id);
    delete req.body.user_id;
    //api validateion;
    const varify = subCategorySchema.validate(req.body);
    if (varify.error) throw { message: varify.error.message };

    const query = `SELECT id FROM sub_category WHERE name = '${req.body.name}' AND category_id = '${req.body.category_id}'`;
    const isExist = await queryDocument(query);
    if (isExist.length) throw { message: "Already added" };

    const sql = "INSERT INTO sub_category SET ";
    const result = await postDocument(sql, req.body);
    if (result.insertId > 0) {
      res.send({ message: "Sub category Added Successfully" });
    } else throw { message: "Unable to Added" };
  } catch (error) {
    deleteImage(req.body.image);
    errorHandler(res, error);
  }
}

export async function deletesubCategory(req, res) {
  try {
    const { error } = await bodyParser(req, res, "", []);
    if (error) throw { message: "Error occured when parsing body" };
    await varifyOwner(req.body.user_id);
    const sql = `DELETE FROM sub_category WHERE id=${req.body.id}`;
    const result = await queryDocument(sql);
    if (result.affectedRows > 0) {
      deleteImage(req.body.image);
      res.send({ message: "Deleted successfully" });
    } else throw { message: "unable to delete" };
  } catch (error) {
    errorHandler(res, error);
  }
}

export async function updateSubtCategory(req, res) {
  try {
    const img = [{ name: "image", maxCount: 1 }];
    const { error } = await bodyParser(req, res, "assets", img);
    if (error) throw { message: "Error occured when image updlading" };

    await varifyOwner(req.body.user_id);
    delete req.body.user_id;
    let exist;
    if (req.files.image) {
      req.body.image = req.files.image[0].filename;
      exist = req.body.existimage;
      delete req.body.existimage;
    }

    const sql = `UPDATE sub_category SET `;
    const option = `WHERE id=${req.query.id}`;
    const result = await postDocument(sql, req.body, option);
    if (result.changedRows > 0) {
      if (exist) {
        deleteImage(exist);
      }
      res.send({ message: "Category Updated Successfully" });
    } else throw { message: "Unable to Update, please try again" };
  } catch (error) {
    if (req.body.image) deleteImage(req.body.image);
    errorHandler(res, error);
  }
}
