import Joi from "joi";
import { postDocument, queryDocument } from "../mysql";
import {
  bodyParser,
  deleteImage,
  errorHandler,
  getDataFromDB,
  varifyOwner,
} from "./common";

export function getOffer(req, res) {
  try {
    if (req.query.id) {
      //send single category;
      const sql = `SELECT * FROM offer WHERE id=${req.query.id}`;
      getDataFromDB(res, sql);
    } else if (req.query.home) {
      // send category for home category page;
      const page = parseInt(req.query.page || 0) * req.query.limit;
      const sql = `SELECT offer.*, p.main_image as product_image, c.name as category_name FROM offer LEFT JOIN product p ON p.id = offer.product_id LEFT JOIN category c ON c.id = offer.category_id LIMIT ${page}, ${req.query.limit}`;
      const count = "SELECT COUNT(id) FROM offer";
      getDataFromDB(res, sql, count);
    } else {
      //send all category
      const sql = "SELECT * FROM offer";
      getDataFromDB(res, sql);
    }
  } catch (error) {
    errorHandler(res, error);
  }
}

const OfferSchema = Joi.object({
  priority: Joi.number().integer().required(),
  title: Joi.string().required(),
  image: Joi.string().required(),
  product: Joi.number(),
  category: Joi.number(),
  all_product: Joi.number(),
  product_id: [Joi.number().integer(), Joi.allow(null)],
  category_id: [Joi.number().integer(), Joi.allow(null)],
});

export async function postOffer(req, res) {
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
    const varify = OfferSchema.validate(req.body);
    if (varify.error) throw { message: varify.error.message };

    const sql = "INSERT INTO offer SET ";
    const result = await postDocument(sql, req.body);
    if (result.insertId > 0) {
      res.send({ message: "Offer Added Successfully" });
    } else throw { message: "Unable to Added" };
  } catch (error) {
    deleteImage(req.body.image);
    errorHandler(res, error);
  }
}

export async function deleteOffer(req, res) {
  try {
    const { error } = await bodyParser(req, res, "", []);
    if (error) throw { message: "Error occured when parsing body" };
    await varifyOwner(req.body.user_id);
    const sql = `DELETE FROM offer WHERE id=${req.body.id}`;
    const result = await queryDocument(sql);
    if (result.affectedRows > 0) {
      deleteImage(req.body.image);
      res.send({ message: "Deleted successfully" });
    } else throw { message: "unable to delete" };
  } catch (error) {
    errorHandler(res, error);
  }
}

export async function updateOffer(req, res) {
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
    if (req.body.category_id === 0) req.body.category_id = null;
    if (req.body.product_id === 0) req.body.product_id = null;

    const sql = `UPDATE offer SET `;
    const option = `WHERE id=${req.query.id}`;
    const result = await postDocument(sql, req.body, option);
    if (result.changedRows > 0) {
      if (exist) {
        deleteImage(exist);
      }
      res.send({ message: "Offer Updated Successfully" });
    } else throw { message: "Unable to Update" };
  } catch (error) {
    if (req.body.image) deleteImage(req.body.image);
    errorHandler(res, error);
  }
}
