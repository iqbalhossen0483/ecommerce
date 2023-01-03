import { errorHandler, forgotMailOpt, mailer, varifyEmailOpt } from "./common";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { postDocument, queryDocument } from "../mysql";

export async function getUser(req, res) {
  try {
    //send email for forget password;
    if (req.query.forgotPassword) {
      sendForgotPasswordLink(req, res);
    } else if (req.query.varifypasswordToken) {
      varifypasswordToken(req, res);
    }
    //varify email;
    else if (req.query.varifyEmail) {
      varifyEmail(req, res);
    }
    //check token in every request;
    else {
      if (!req.query.token) {
        throw { message: "Unauthenticated", status: 401 };
      }
      const varify = jwt.verify(req.query.token, process.env.JWT_SECRET);

      const database = varify.user_role === "vendor" ? "vandor" : "user";
      const sql = `SELECT * FROM ${database} WHERE id = ${varify.id} AND email = '${varify.email}'`;
      const user = await queryDocument(sql);
      if (!user.length) throw { message: "Something went wrong" };
      delete user[0].password;

      const token = jwt.sign({ ...user[0] }, process.env.JWT_SECRET, {
        expiresIn: `${varify.user_role !== "customer" ? "3d" : "5h"}`,
      });
      res.send({ user: user[0], token });
    }
  } catch (error) {
    return errorHandler(res, error);
  }
}

export async function loginUser(req, res) {
  try {
    //social media login;
    if (req.query.socialLogin) {
      const sql = `SELECT * FROM user WHERE email = '${req.body.email}'`;
      const result = await queryDocument(sql);
      if (!result.length) {
        if (process.env.NEXT_PUBLIC_APP_PASSWORD !== req.body.password) {
          throw { message: "Forbiden", status: 403 };
        }
        const hashed = await bcrypt.hash(req.body.password, 10);
        req.body.password = hashed;
        const sql = "INSERT INTO user ";
        const result = await postDocument(sql, req.body);
        delete result[0].password;
        const token = jwt.sign({ ...result[0] }, process.env.JWT_SECRET, {
          expiresIn: "3d",
        });
        res.send({ user: result[0], token });
      } else {
        const sql = `SELECT * FROM user WHERE email = '${req.body.email}'`;
        const result = await queryDocument(sql);
        delete result[0].password;
        const token = jwt.sign({ ...result[0] }, process.env.JWT_SECRET, {
          expiresIn: `${result[0].user_role !== "customer" ? "3d" : "5h"}`,
        });
        res.send({ user: result[0], token });
      }
    }
    // normal email login
    else {
      const sql = `SELECT * FROM user WHERE email = '${req.body.email}'`;
      const result = await queryDocument(sql);
      if (!result.length) {
        const sql = `SELECT * FROM vandor WHERE email = '${req.body.email}'`;
        const result = await queryDocument(sql);
        if (!result.length) {
          throw { message: "No user found", status: 404 };
        } else {
          sendUserInfo(req, res, result);
        }
      } else {
        sendUserInfo(req, res, result);
      }
    }
  } catch (error) {
    errorHandler(res, error);
  }
}

export async function signUpUser(req, res) {
  try {
    //update user password;
    if (req.query.updateuser) {
      const sql = `SELECT * FROM user WHERE id = '${req.body.id}' AND email = '${req.body.email}'`;
      const result = await queryDocument(sql);
      if (!result.length) throw { message: "There was an error" };
      const hashed = await bcrypt.hash(req.body.password, 10);
      const query = `UPDATE user SET password='${hashed}' WHERE id=${req.body.id}`;
      const user = await queryDocument(query);
      if (user.changedRows > 0) {
        const sql = `SELECT * FROM user WHERE id = '${req.body.id}'`;
        const result = await queryDocument(sql);
        const token = jwt.sign({ ...result[0] }, process.env.JWT_SECRET, {
          expiresIn: `${result[0].user_role !== "customer" ? "3d" : "5h"}`,
        });
        res.send({
          message: "Your password updated successfully",
          token,
        });
      } else throw { message: "Unable to update, please try again" };
    }
    //send email for varify eamil;
    else {
      const sql = `SELECT * FROM user WHERE email = '${req.body.email}'`;
      const result = await queryDocument(sql);

      if (result.length) throw { message: "User already exist", status: 409 };

      const token = jwt.sign(req.body, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      const options = varifyEmailOpt(req.body.email, token);
      const email = await mailer.sendMail(options);
      if (email.messageId) {
        res.send({ message: "An email sent to your email, please check" });
      } else throw { message: "There was an error" };
    }
  } catch (error) {
    errorHandler(res, error);
  }
}

async function sendForgotPasswordLink(req, res) {
  try {
    const sql = `SELECT * FROM user WHERE email = '${req.query.forgotPassword}'`;
    const result = await queryDocument(sql);
    if (!result.length) {
      throw { message: "No user found", status: 404 };
    }
    delete result[0].password;
    const token = jwt.sign({ ...result[0] }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const options = forgotMailOpt(req.query.forgotPassword, token);
    const email = await mailer.sendMail(options);
    if (email.messageId) {
      res.send({ message: "An email sent to your email, please check" });
    } else throw { message: "There was an error" };
  } catch (error) {
    errorHandler(res, error);
  }
}

async function varifyEmail(req, res) {
  try {
    const varifyUser = jwt.verify(
      req.query.varifyEmail,
      process.env.JWT_SECRET
    );
    if (!varifyUser) throw { message: "Token expired" };
    delete varifyUser.iat;
    delete varifyUser.exp;

    const hashedPassword = await bcrypt.hash(varifyUser.password, 10);
    varifyUser.password = hashedPassword;
    const sql = "INSERT INTO user SET ";
    const user = postDocument(sql, varifyUser);
    if (user.insertId > 0) {
      const sql = `SELECT * FROM user WHERE id = '${result.insertId}'`;
      const result = queryDocument(sql);
      delete result[0].password;
      const token = jwt.sign({ ...result[0] }, process.env.JWT_SECRET, {
        expiresIn: "3d",
      });
      res.send({ user: result[0], token });
    } else {
      res.send({ message: "Unable to Added" });
    }
  } catch (error) {
    errorHandler(res, error);
  }
}

function varifypasswordToken(req, res) {
  try {
    const result = jwt.verify(
      req.query.varifypasswordToken,
      process.env.JWT_SECRET
    );
    if (!result) throw { message: "Token expired" };
    delete result.exp;
    delete result.iat;
    res.send(result);
  } catch (error) {
    errorHandler(res, error);
  }
}

async function sendUserInfo(req, res, result) {
  try {
    const isRightPassword = await bcrypt.compare(
      req.body.password,
      result[0].password
    );
    if (!isRightPassword) {
      throw { message: "Username or password incorrect", status: 401 };
    } else {
      delete result[0].password;
      const token = jwt.sign({ ...result[0] }, process.env.JWT_SECRET, {
        expiresIn: `${result[0].user_role !== "customer" ? "3d" : "5h"}`,
      });
      res.send({ user: result[0], token });
    }
  } catch (error) {
    errorHandler(res, error);
  }
}
