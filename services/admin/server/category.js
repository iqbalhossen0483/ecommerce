import Joi from "joi";
import { postDocument, queryDocument } from "../mysql";
import {
  bodyParser,
  deleteImage,
  errorHandler,
  getDataFromDB,
  varifyOwner,
} from "./common";

export function getCategory(req, res) {
  try {
    if (req.query.id) {
      //send single category;
      const sql = `SELECT * FROM category WHERE id=${req.query.id}`;
      getDataFromDB(res, sql);
    } else if (req.query.home) {
      // send category for home category page;
      const page = parseInt(req.query.page || 0) * req.query.limit;
      const sql = `SELECT * FROM category ORDER BY priority LIMIT ${page}, ${req.query.limit}`;
      const count = "SELECT COUNT(id) FROM category";
      getDataFromDB(res, sql, count);
    } else {
      //send all category
      const sql = `SELECT ${
        req.query.opt || "*"
      } FROM category ORDER BY priority`;
      getDataFromDB(res, sql);
    }
  } catch (error) {
    errorHandler(res, error);
  }
}

const CategorySchema = Joi.object({
  priority: Joi.number().required(),
  name: Joi.string().required(),
  description: Joi.string().required().max(100),
  image: Joi.string().required(),
});

export async function postCategory(req, res) {
  try {
    const img = [{ name: "image", maxCount: 1 }];

    const { error } = await bodyParser(req, res, "assets", img);
    if (error || !req.files.image) {
      throw { message: "Error occured when image updlading" };
    }
    req.body.image = req.files.image[0].filename;
    await varifyOwner(req.body.user_id);
    req.body.priority = parseInt(req.body.priority);
    delete req.body.user_id;

    //api validateion;
    const varify = CategorySchema.validate(req.body);
    if (varify.error) throw { message: varify.error.message };

    const query = `SELECT id FROM category WHERE name = '${req.body.name}'`;
    const isExist = await queryDocument(query);
    if (isExist.length) throw { message: "Already added" };

    const sql = "INSERT INTO category SET ";
    const result = await postDocument(sql, req.body);
    if (result.insertId > 0) {
      res.send({ message: "Category Added Successfully" });
    } else throw { message: "Unable to Added" };
  } catch (error) {
    deleteImage(req.body.image);
    errorHandler(res, error);
  }
}

export async function deleteCategory(req, res) {
  try {
    const { error } = await bodyParser(req, res, "", []);
    if (error) {
      throw { message: "Error occured when parsing body" };
    }
    //delete category;
    const categoryQuery = `DELETE FROM category WHERE id=${req.body.id}`;
    const category = await queryDocument(categoryQuery);
    if (category.affectedRows > 0) {
      deleteImage(req.body.image);
      res.send({ message: "Deleted successfully" });
    } else throw { message: "unable to delete" };

    //find sub category under this categroy;
    const subgettingq = `SELECT id, image FROM sub_category WHERE category_id=${req.body.id}`;
    const subCategory = await queryDocument(subgettingq);
    const subId = [],
      imges = [];
    if (subCategory.length) {
      subCategory.forEach((item) => {
        subId.push(item.id);
        imges.push(item.image);
      });
    }
    if (subId.length) {
      //delete sub category under this category;
      const subyQuery = `DELETE FROM sub_category WHERE category_id=${req.body.id}`;
      const subcategory = await queryDocument(subyQuery);
      if (subcategory.affectedRows > 0) {
        imges.forEach((img) => deleteImage(img));
      } else throw { message: "unable to delete sub category" };

      // delete pro sub category under those sub category;
      const prosubsql = `DELETE FROM pro_sub_category WHERE sub_category_id IN(${subId.join(
        ","
      )})`;
      const prosub = await queryDocument(prosubsql);
      if (prosub.affectedRows > 0) {
        res.send({ message: "Deleted successfully" });
      } else throw { message: "unable to delete pro sub category" };
    }
  } catch (error) {
    errorHandler(res, error);
  }
}

export async function updatetCategory(req, res) {
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
    const sql = `UPDATE category SET `;
    const option = `WHERE id=${req.query.id}`;
    const result = await postDocument(sql, req.body, option);
    if (result.changedRows > 0) {
      if (exist) {
        deleteImage(exist);
      }
      res.send({ message: "Category Updated Successfully" });
    } else throw { message: "Unable to Update" };
  } catch (error) {
    errorHandler(res, error);
  }
}
