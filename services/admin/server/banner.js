import Joi from "joi";
import { postDocument, queryDocument } from "../mysql";
import {
  bodyParser,
  deleteImage,
  errorHandler,
  getDataFromDB,
  varifyOwner,
} from "./common";

export function getBanner(req, res) {
  try {
    if (req.query.id) {
      //send single category;
      const sql = `SELECT * FROM banner WHERE id=${req.query.id}`;
      getDataFromDB(res, sql);
    } else if (req.query.home) {
      // send category for home category page;
      const page = parseInt(req.query.page || 0) * req.query.limit;
      const sql = `SELECT * FROM banner LIMIT ${page}, ${req.query.limit}`;
      const count = "SELECT COUNT(id) FROM banner";
      getDataFromDB(res, sql, count);
    } else {
      //send all category
      const sql = "SELECT * FROM banner";
      getDataFromDB(res, sql);
    }
  } catch (error) {
    errorHandler(res, error);
  }
}

const bannerSchema = Joi.object({
  position: Joi.string().required(),
  link: Joi.string().required(),
  image: Joi.string().required(),
});

export async function postBanner(req, res) {
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
    const varify = bannerSchema.validate(req.body);
    if (varify.error) throw { message: varify.error.message };

    const sql = "INSERT INTO banner SET ";
    const result = await postDocument(sql, req.body);
    if (result.insertId > 0) {
      res.send({ message: "Banner Added Successfully" });
    } else throw { message: "Unable to Added" };
  } catch (error) {
    deleteImage(req.body.image);
    errorHandler(res, error);
  }
}

export async function deleteBanner(req, res) {
  try {
    const { error } = await bodyParser(req, res, "", []);
    if (error) throw { message: "Error occured when image updlading" };
    const sql = `DELETE FROM banner WHERE id=${req.body.id}`;
    const result = await queryDocument(sql);
    if (result.affectedRows > 0) {
      deleteImage(req.body.image);
      res.send({ message: "Deleted successfully" });
    } else throw { message: "unable to delete" };
  } catch (error) {
    errorHandler(res, error);
  }
}

export async function updateBanner(req, res) {
  try {
    const img = [{ name: "image", maxCount: 1 }];
    const { error } = await bodyParser(req, res, "assets", img);
    if (error) throw { message: "Error occured when image updlading" };

    await varifyOwner(req.body.user_id);
    let exist;
    if (req.files.image) {
      req.body.image = req.files.image[0].filename;
      exist = req.body.existimage;
      delete req.body.existimage;
    }
    delete req.body.user_id;
    const sql = `UPDATE banner SET `;
    const option = `WHERE id=${req.query.id}`;
    const result = await postDocument(sql, req.body, option);
    if (result.changedRows > 0) {
      if (exist) {
        deleteImage(exist);
      }
      res.send({ message: "Slider Updated Successfully" });
    } else throw { message: "Unable to Update, please try again" };
  } catch (error) {
    errorHandler(res, error);
  }
}
