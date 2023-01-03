import Joi from "joi";
import { postDocument, queryDocument } from "../mysql";
import { errorHandler, getDataFromDB, varifyOwner } from "./common";

export async function getOder(req, res) {
  try {
    await varifyOwner(req.query.user_id);
    if (req.query.id) {
      //send single order;
      const sql = `SELECT * FROM orders WHERE id=${req.query.id}`;
      getDataFromDB(res, sql);
    }
    //
    else if (req.query.date && req.query.status) {
      if (!req.query.start && !req.query.end) {
        throw { message: "Start date and End date must be given" };
      }
      const limit = req.query.limit || 10;
      const page = parseInt(req.query.page || 0) * limit;
      const sql = `SELECT * FROM orders WHERE created_at >= '${req.query.start}' AND created_at <= '${req.query.end}' AND status = '${req.query.status}' LIMIT ${page}, ${limit}`;
      const count = `SELECT COUNT(id) FROM orders WHERE created_at >= '${req.query.start}' AND created_at <= '${req.query.end}' AND status = '${req.query.status}'`;
      getDataFromDB(res, sql, count);
    }
    // send orders based on status;
    else if (req.query.status) {
      const limit = req.query.limit || 10;
      const page = parseInt(req.query.page || 0) * limit;
      const sql = `SELECT * FROM orders WHERE status = '${req.query.status}' LIMIT ${page}, ${limit}`;
      const count = `SELECT COUNT(id) FROM orders WHERE status = '${req.query.status}'`;
      getDataFromDB(res, sql, count);
    }
    // send orders based on datae;
    else if (req.query.date) {
      if (!req.query.start && !req.query.end) {
        throw { message: "Start date and End date must be given" };
      }
      const limit = req.query.limit || 10;
      const page = parseInt(req.query.page || 0) * limit;
      const sql = `SELECT * FROM orders WHERE created_at >= '${req.query.start}' AND created_at <= '${req.query.end}' LIMIT ${page}, ${limit}`;
      const count = `SELECT COUNT(id) FROM orders WHERE created_at BETWEEN '${req.query.start}' AND '${req.query.end}'`;
      getDataFromDB(res, sql, count);
    }
    //send customer whose placed order ;
    else if (req.query.customer) {
      const limit = req.query.limit || 10;
      const page = parseInt(req.query.page || 0) * limit;
      const sql = `SELECT DISTINCT customer_id FROM orders LIMIT ${page}, ${limit}`;
      const customer = await queryDocument(sql);
      if (!customer.length) {
        throw { message: "Not Found", status: 404 };
      }
      const customerId = [];
      customer.forEach((item) => customerId.push(item.customer_id));
      const query = `SELECT * FROM user WHERE id IN(${customerId})`;
      const countsql = "SELECT DISTINCT customer_id FROM orders";
      const data = await queryDocument(query);
      const count = await queryDocument(countsql);
      res.send({ count: count.length, data });
    }
    // send orders for home order page;
    else {
      const limit = req.query.limit || 10;
      const page = parseInt(req.query.page || 0) * limit;
      const sql = `SELECT * FROM orders LIMIT ${page}, ${limit}`;
      const count = "SELECT COUNT(id) FROM orders";
      getDataFromDB(res, sql, count);
    }
  } catch (error) {
    errorHandler(res, error);
  }
}

const ProductSchema = Joi.object().keys({
  product_id: Joi.number().integer().required(),
  image: Joi.string().required(),
  name: Joi.string().required(),
  price: Joi.number().required(),
  quantity: Joi.number().required(),
  size: Joi.string(),
  colour: Joi.string(),
});

const OrderSchema = Joi.object({
  created_at: Joi.date().required(),
  order_id: Joi.string().required(),
  invoice_id: Joi.string().required(),
  vandor_id: Joi.number().integer().required(),
  sub_total: Joi.number().required(),
  discount: Joi.number().required(),
  tax: Joi.number().required(),
  shipping_charge: Joi.number().required(),
  total: Joi.number().required(),
  customer_id: Joi.number().integer().required(),
  customer_name: Joi.string().required(),
  customer_email: Joi.string().email().required(),
  shipping_address: Joi.string().required(),
  customer_comment: Joi.string(),
  customer_number: Joi.string().required(),
  status: Joi.string().valid("processing", "shipping", "delivered", "canceled"),
  delivery_date: Joi.date().required(),
  payment_method: Joi.string().valid("cash on delivery", "online payment"),
  product_info: Joi.array().items(ProductSchema),
});

export async function postOrder(req, res) {
  try {
    if (!req.body.product_info.length) {
      throw { message: "product not found" };
    }
    req.body.created_at = new Date();
    req.body.order_id = "OR-" + Date.now();
    req.body.invoice_id = "INV-" + Date.now();
    //api validateion;
    const varify = OrderSchema.validate(req.body);
    if (varify.error) throw { message: varify.error.message };

    //check user is exist to db;
    const query_1 = `SELECT id number FROM user WHERE id = '${req.body.customer_id}' AND email = '${req.body.customer_email}'`;
    const isUser = await queryDocument(query_1);
    if (!isUser.length) {
      throw { message: "Unknown user", status: 403 };
    }

    //user esist  all done, go ahead;
    const product = req.body.product_info;
    const errors = [];

    product.forEach(async (item) => {
      //now check stock whether available;
      const query_3 = `SELECT stock FROM product WHERE id = '${item.product_id}'`;
      const result = await queryDocument(query_3);
      //product is not found in db;
      if (!result.length) {
        errors.push(item.product_id);
      }
      //stock is not available;
      else if (result[0].stock < item.quantity) {
        errors.push(item.product_id);
      }
    });

    //is error exist, filter the product;
    if (errors.length) {
      const existedProduct = product.filter((item) => {
        for (let i = 0; i < errors.length; i++) {
          if (item.product_id !== errors[i]) {
            return true;
          } else return false;
        }
      });
      req.body.product_info = existedProduct;
    }
    //if all product are invalid ;
    if (!req.body.product_info.length) {
      throw { message: "Forbidden", status: 403 };
    }
    //finally save to db, all operation done;
    req.body.product_info = JSON.stringify(req.body.product_info);
    const query_4 = "INSERT INTO orders SET ";
    const order = await postDocument(query_4, req.body);

    if (order.insertId > 0) {
      JSON.parse(req.body.product_info).forEach(async (product) => {
        const query_5 = `UPDATE product SET stock = stock - ${product.quantity} WHERE id= ${product.product_id}`;
        await queryDocument(query_5);
      });
      //update user profile if not update
      if (isUser[0].number !== req.body.customer_number) {
        const query_2 = `UPDATE user SET number = '${req.body.customer_number}', address = '${req.body.shipping_address}'  WHERE id = '${req.body.customer_id}'`;
        await queryDocument(query_2);
      }
      res.send({ message: "Order Created Successfully" });
    } else throw { message: "Unable to Added" };
  } catch (error) {
    errorHandler(res, error);
  }
}

export async function updateOrder(req, res) {
  try {
    await varifyOwner(req.body.user_id);
    if (req.body.order_status === "delivered") {
      throw { message: "This order was delivered", status: 403 };
    }
    const sql = `UPDATE orders SET status = '${req.body.status}' WHERE id=${req.query.id}`;
    const result = await queryDocument(sql);
    if (result.changedRows == 0) {
      throw { message: "Unable to Update" };
    }
    const status = req.body.status;
    const orderStatus = req.body.order_status;

    if (orderStatus === "canceled" && status !== "canceled") {
      JSON.parse(req.body.products).forEach(async (product) => {
        const query = `UPDATE product SET stock = stock - ${product.quantity} WHERE id= ${product.product_id}`;
        await queryDocument(query);
        //update user;
        if (status === "delivered") {
          updateUser(req, res, req.body.products);
        } else res.send({ message: "Order Updated Successfully" });
      });
    } else if (status === "delivered") {
      //update user;
      updateUser(req, res, req.body.products);
    } else if (status === "canceled") {
      JSON.parse(req.body.products).forEach(async (product) => {
        const query = `UPDATE product SET stock = stock + ${product.quantity} WHERE id= ${product.product_id}`;
        await queryDocument(query);
      });
      res.send({ message: "Order Updated Successfully" });
    }
  } catch (error) {
    errorHandler(res, error);
  }
}

export async function deleteOrder(req, res) {
  try {
    const sql = `DELETE FROM orders WHERE id=${req.query.id}`;
    const result = await queryDocument(sql);
    if (result.affectedRows > 0) {
      res.send({ message: "Deleted successfully" });
    } else throw { message: "unable to delete" };
  } catch (error) {
    errorHandler(res, error);
  }
}

async function updateUser(req, res, product) {
  try {
    const queryUser = `UPDATE user SET order_placed = order_placed + ${1} WHERE id= ${
      req.body.customer_id
    }`;
    await queryDocument(queryUser);

    //update vendor;
    const queryVandor = `UPDATE vandor SET delivered_order = delivered_order + ${1} WHERE id= ${
      req.body.vendor_id
    }`;
    await queryDocument(queryVandor);

    //update product;
    JSON.parse(product).forEach(async (pro) => {
      const query = `UPDATE product SET delivered_order = delivered_order + ${1} WHERE id= ${
        pro.product_id
      }`;
      await queryDocument(query);
    });
    res.send({ message: "Order Updated Successfully" });
  } catch (error) {
    errorHandler(res, error);
  }
}
