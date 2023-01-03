import { queryDocument } from "../mysql";
import { errorHandler } from "./common";

export async function getDashboardData(req, res) {
  if (req.query.report) {
    sendReport(res);
  } else {
    sendDashboardData(res);
  }
}

async function sendReport(res) {
  try {
    //total product;
    const productsql = `SELECT COUNT(id) FROM product`;
    const productCount = await queryDocument(productsql);
    const data = {};
    data.total_product = productCount[0]["COUNT(id)"];

    //total sales;
    const totalsql = `SELECT total FROM orders`;
    const totalSale = await queryDocument(totalsql);
    let total = 0;
    for (const order of totalSale) {
      total += order.total;
    }
    data.total_sale = total;

    // todays order;
    const date = new Date().toISOString().slice(0, 10);
    let yesterday = new Date(new Date().valueOf() - 1000 * 60 * 60 * 24)
      .toISOString()
      .slice(0, 10);
    const todaySalesql = `SELECT id FROM orders WHERE created_at BETWEEN ${date} AND  ${yesterday}`;
    const totalProduct = await queryDocument(todaySalesql);
    data.todaysOrder = totalProduct.length;

    //pending order;
    const pendingOrdersql = `SELECT id FROM orders WHERE status = 'processing'`;
    const pendingOrder = await queryDocument(pendingOrdersql);
    data.pendingOrder = pendingOrder.length;

    //canceled order;
    const canceledOrdersql = `SELECT id FROM orders WHERE status = 'canceled'`;
    const canceledOrder = await queryDocument(canceledOrdersql);
    data.canceledOrder = canceledOrder.length;

    //Low stock product
    const lowStockProductsql = `SELECT id FROM product WHERE stock <= 5`;
    const lowStockProduct = await queryDocument(lowStockProductsql);
    data.lowStockProduct = lowStockProduct.length;

    //top sold product
    const topSoldProductsql = `SELECT id FROM product WHERE delivered_order >= 20`;
    const topSoldProduct = await queryDocument(topSoldProductsql);
    data.topSoldProduct = topSoldProduct.length;

    // total vandor
    const totalVandorsql = `SELECT id FROM vandor`;
    const totalVandor = await queryDocument(totalVandorsql);
    data.totalVandor = totalVandor.length;

    res.send(data);
  } catch (error) {
    errorHandler(res, error);
  }
}

async function sendDashboardData(res) {
  try {
    const data = {};
    const topCustomersql = `SELECT id, profile, name FROM user ORDER BY order_placed LIMIT 5`;
    const topCustomer = await queryDocument(topCustomersql);
    data.topCustomer = topCustomer;

    const topSalersql = `SELECT id, shop_logo, name FROM vandor ORDER BY delivered_order LIMIT 5`;
    const topSaler = await queryDocument(topSalersql);
    data.topSaler = topSaler;

    const topProductsql = `SELECT id, main_image, name FROM product ORDER BY delivered_order LIMIT 5`;
    const topProduct = await queryDocument(topProductsql);
    data.topProduct = topProduct;

    const topRatedProductsql = `SELECT DISTINCT customer_review.product_id as id, product.name, product.main_image FROM customer_review INNER JOIN product ON product.id = customer_review.product_id LIMIT 5`;
    const topRatedProduct = await queryDocument(topRatedProductsql);
    data.topRatedProduct = topRatedProduct;

    res.send(data);
  } catch (error) {
    errorHandler(res, error);
  }
}
