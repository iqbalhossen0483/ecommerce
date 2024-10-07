import Joi from "joi";
import { postDocument, queryDocument } from "../mysql";
import {
  bodyParser,
  deleteImage,
  errorHandler,
  getDataFromDB,
  varifyUser,
} from "./common";

//get common function;
function sendSpecifiqData(req, res, name, query) {
  const limit = req.query.limit || 10;
  const page = parseInt(req.query.page || 0) * limit;
  let sql = "";
  let count = "";
  if (name && query) {
    sql = `SELECT * FROM product WHERE ${name} = '${query}' ORDER BY created_at DESC LIMIT ${page}, ${limit}`;
    count = "SELECT COUNT(id) FROM product";
  } else if (req.query.user_type === "vendor") {
    sql = `SELECT * FROM product WHERE created_by = '${req.query.user_id}' AND user_type = '${req.query.user_type}' ORDER BY created_at DESC LIMIT ${page}, ${limit}`;
    count = `SELECT COUNT(id) FROM product WHERE created_by = '${req.query.user_id}' AND user_type = '${req.query.user_type}'`;
  } else {
    sql = `SELECT ${
      req.query.opt || "*"
    } FROM product ORDER BY created_at DESC LIMIT ${page}, ${limit}`;
    count = "SELECT COUNT(id) FROM product";
  }
  getDataFromDB(res, sql, count);
}

export function getProduct(req, res) {
  try {
    if (req.query.id) {
      //send single category;
      const sql = `SELECT * FROM product WHERE id=${req.query.id}`;
      getDataFromDB(res, sql);
    } else if (req.query.category) {
      //send all category product
      const limit = req.query.limit || 10;
      const page = parseInt(req.query.page || 0) * limit;
      const sql = `SELECT * FROM product WHERE category_id = '${req.query.category}' ORDER BY created_at DESC LIMIT ${page}, ${limit}`;
      const count = "SELECT COUNT(id) FROM product";
      getDataFromDB(res, sql, count);
    } else if (req.query.subCategory) {
      //send all  sub category product
      sendSpecifiqData(req, res, "sub_category_id", req.query.subCategory);
    } else if (req.query.proSubCategory) {
      //send all category product
      sendSpecifiqData(req, res, "pro_sub_id", req.query.proSubCategory);
    } else {
      //send all product
      sendSpecifiqData(req, res);
    }
  } catch (error) {
    errorHandler(res, error);
  }
}

const ProductSchema = Joi.object({
  created_by: Joi.number().integer().required(),
  user_type: Joi.string().valid("vendor", "owner", "uploader").required(),
  name: Joi.string().required(),
  brand: Joi.number().integer(),
  sku: Joi.string().required(),
  price: Joi.number().required(),
  prev_price: Joi.number(),
  tax: Joi.number(),
  stock: Joi.number().required(),
  keyword: Joi.string().required(),
  category_id: Joi.number().integer().required(),
  sub_category_id: Joi.number().integer(),
  pro_sub_id: Joi.number().integer(),
  short_description: Joi.string().required().max(200),
  description: Joi.string().required().max(700),
  main_image: Joi.string().required(),
  features_img: Joi.string().required(),
  type: Joi.string().valid("single", "package").required(),
  colour: Joi.string(),
  size: Joi.string(),
  unit: Joi.string().valid("piece", "kg"),
  qr_code: Joi.string().required(),
});

export async function postProduct(req, res) {
  try {
    const img = [
      { name: "main_image", maxCount: 1 },
      { name: "features_img", maxCount: 5 },
    ];
    const { error } = await bodyParser(req, res, "assets", img);
    if (error || !req.files.main_image || !req.files.features_img) {
      throw { message: "Error occured when image updlading" };
    }

    //images;
    req.body.main_image = req.files.main_image[0].filename;
    let features_img = "";
    req.files.features_img.forEach((img) => {
      features_img += img.filename + "|";
    });

    await varifyUser(req.body.user_id, req.body.user_type);

    delete req.body.user_id;
    req.body.features_img = features_img;

    //api validateion;
    const varify = ProductSchema.validate(req.body);
    if (varify.error) throw { message: varify.error.message };

    //check sku is exist;
    const query = `SELECT * FROM product WHERE sku = '${req.body.sku}'`;
    const isExist = await queryDocument(query);
    if (isExist.length) {
      throw { message: "Already this SKU added, try with different SKU" };
    }
    //procced to uploading product;
    const sql = "INSERT INTO product SET ";
    const result = await postDocument(sql, req.body);
    if (result.insertId > 0) {
      res.send({ message: "Product Added Successfully" });
    } else throw { message: "Unable to Added" };
  } catch (error) {
    resError(req, res, error);
  }
}

export async function deleteProduct(req, res) {
  try {
    const { error } = await bodyParser(req, res, "", []);
    if (error) throw { message: "Error occured when parsing body" };

    await varifyUser(req.body.user_id, req.body.user_type);

    const sql = `DELETE FROM product WHERE id=${req.body.id}`;
    const result = await queryDocument(sql);
    if (result.affectedRows > 0) {
      JSON.parse(req.body.image).forEach((img) => {
        deleteImage(img);
      });
      res.send({ message: "Deleted successfully" });
    } else throw { message: "unable to delete" };
  } catch (error) {
    errorHandler(res, error);
  }
}

export async function updateProduct(req, res) {
  try {
    const img = [
      { name: "main_image", maxCount: 1 },
      { name: "features_img", maxCount: 5 },
    ];
    const { error } = await bodyParser(req, res, "assets", img);
    if (error) {
      throw { message: "Error occured when image updlading" };
    }
    await varifyUser(req.body.user_id, req.body.user_type);
    delete req.body.user_id;

    if (Object.keys(req.body).length < 2) {
      throw { message: "No updated feild found", status: 404 };
    }

    if (req.files.main_image) {
      req.body.main_image = req.files.main_image[0].filename;
    }

    let features_img = "";
    if (req.files.features_img) {
      req.files.features_img.forEach((img) => {
        features_img += img.filename + "|";
      });
    }

    if (req.body.needImage) {
      JSON.parse(req.body.needImage).forEach((img) => {
        features_img += img + "|";
      });
      delete req.body.needImage;
    }
    if (features_img.length) {
      req.body.features_img = features_img;
    }

    let deleteImg;
    if (req.body.deleteImage) {
      deleteImg = JSON.parse(req.body.deleteImage);
      delete req.body.deleteImage;
    }
    const sql = `UPDATE product SET `;
    const option = `WHERE id=${req.query.id}`;
    const result = await postDocument(sql, req.body, option);
    if (result.changedRows > 0) {
      if (deleteImg) {
        deleteImg.forEach((img) => {
          deleteImage(img);
        });
      }
      res.send({ message: "Product Updated Successfully" });
    } else throw { message: "Unable to Update" };
  } catch (error) {
    resError(req, res, error);
  }
}

function resError(req, res, error) {
  if (req.files.main_image) {
    deleteImage(req.files.main_image[0].filename);
  }
  if (req.files.features_img) {
    req.files.features_img.forEach((img) => {
      deleteImage(img.filename);
    });
  }
  errorHandler(res, error);
}
