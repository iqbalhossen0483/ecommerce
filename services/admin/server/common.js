import multer from "multer";
import path from "path";
import fs from "fs";
import nodemailer from "nodemailer";
import { queryDocument } from "../mysql";

export const mailer = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "navieausa@gmail.com",
    pass: process.env.NODEMAILER_SECRET,
  },
});

export async function varifyOwner(user_id) {
  try {
    if (!user_id) throw { message: "Forbiden", status: 403 };

    const sql = `SELECT id, user_role FROM user WHERE id = '${user_id}'`;
    const result = await queryDocument(sql);
    if (!result.length || result[0].user_role !== "owner") {
      throw { message: "Forbidden", status: 409 };
    }
  } catch (error) {
    throw error;
  }
}

export async function varifyUser(user_id, user_type) {
  try {
    if (!user_id && !user_type) {
      throw { message: "Forbiden", status: 403 };
    }
    let sql = "";
    if (user_type === "vendor") {
      sql = `SELECT id, user_role FROM vandor WHERE id = '${user_id}'`;
    } else {
      sql = `SELECT id, user_role FROM user WHERE id = '${user_id}'`;
    }
    const result = await queryDocument(sql);
    if (!result.length || !/owner|uploader|vendor/.test(result[0].user_role)) {
      throw { message: "Forbidden", status: 409 };
    }
  } catch (error) {
    throw error;
  }
}

export async function getDataFromDB(res, query, count = undefined) {
  try {
    const data = await queryDocument(query);
    if (count) {
      const totalDocument = await queryDocument(count);
      res.send({ count: totalDocument[0]["COUNT(id)"], data });
    } else res.send(data);
  } catch (error) {
    errorHandler(res, { message: error.message });
  }
}

export async function bodyParser(req, res, folder, images) {
  try {
    const MulterConfiq = multer({
      storage: multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, path.join(process.cwd(), "public", folder));
        },
        filename(req, file, cb) {
          let fileName;
          const isFavicon = req.files.favicon;
          if (isFavicon) {
            fileName = "favicon.ico";
          } else {
            fileName = `${file.fieldname}-${Date.now()}${path.extname(
              file.originalname
            )}`;
          }
          cb(null, fileName);
        },
      }),
      fileFilter: (req, file, cb) => {
        const filetypes = /jpg|jpeg|png|gif/;
        const extname = filetypes.test(
          path.extname(file.originalname).toLowerCase()
        );
        const mimetype = filetypes.test(file.mimetype);

        if (extname && mimetype) {
          return cb(null, true);
        } else {
          cb("Unsupported file extension");
        }
      },
      limits: 1000000,
    });

    await new Promise((resolve) => {
      const multer = MulterConfiq.fields(images);
      multer(req, res, resolve);
    });
    return { error: false };
  } catch (err) {
    return { error: err.message };
  }
}

export function errorHandler(res, error) {
  console.log(error);
  res
    .status(error.status || 500)
    .send({ message: error.message || "Serverside error" });
}

export function deleteImage(image) {
  try {
    fs.unlinkSync(path.join(process.cwd(), "public", "assets", image));
  } catch (error) {
    console.log(error);
  }
}

export function forgotMailOpt(email, token) {
  return {
    from: "navieausa@gmail.com", // sender address
    to: email, // list of receivers
    subject: "Reset your password", // Subject line
    html: html(`<div class="contentArea">
    <div class="section2">
      <h1>Forgot password ?</h1>
      <p class="mb-50">You/someone try to reset your account password. Here is the link to reset password.</p>
      <center><a href="http://localhost:3000/forgotpassword?token=${token}" class="confirmBtn">Reset Now</a></center>
      <p>If you have any question , just reply to this email, we're always happy to help out</p>
      <p class="mt-50">Cheers<br>The Team</p>
    </div>
  </div>`),
  };
}
export function varifyEmailOpt(email, token) {
  return {
    from: "navieausa@gmail.com", // sender address
    to: email, // list of receivers
    subject: "Varify your Account", // Subject line
    html: html(`<div class="contentArea">
    <div class="section2">
      <h1>Verify your account !</h1>
      <p class="mb-50">
        Thank you for signig up with Us! We hope you enjoy your time with us.
        Check your account and update your profile.
      </p>
      <center><a href="http://localhost:3000/varifyemail?token=${token}" class="confirmBtn">Verify Now</a></center>
      <p class="mt-50">
        if you have any question just reply to this email, We're always happy
        to help out.
      </p>
      <p class="mt-50">Cheers<br />The Team</p>
    </div>
  </div>`),
  };
}

function html(body) {
  return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <style>
          body {
            padding: 0;
            margin: 0;
            background: #f7f8f8;
          }
          
          .contentArea {
            margin: 0 auto;
            display: block;
            width: 800px;
          }
          .section2 {
            background: #fff;
            margin-top: 50px;
            padding: 50px;
            font-family: Roboto, sans-serif;
          }
          .section2 h1 {
            font-size: 55px;
            text-align: center;
            letter-spacing: 5px;
            font-weight: 500;
          }
          .section2 p {
            font-size: 20px;
            color: #7aa182;
          }
          .mb-50 {
            margin-bottom: 50px;
          }
          .mt-50 {
            margin-top: 50px;
          }
          .confirmBtn {
            background: #16c1f3;
            color: #fff;
            padding: 10px 20px;
            border: none;
            font-size: 20px;
            text-decoration: none;
            border-radius: 5px;
          }
          .section2 .linkTag {
            color: #faa635;
            font-size: 20px;
          }
          @media only screen and (max-width: 800px) {
            .contentArea {
              width: 100%;
            }
          }
          @media only screen and (max-width: 550px) {
            .section2 h1 {
              font-size: 45px;
            }
            .section2 p {
              font-size: 18px;
            }
            .confirmBtn {
              font-size: 16px;
            }
            .section2 .linkTag {
              font-size: 18px;
            }
          }
        </style>
      </head>
      <body>   
        ${body}
      </body>
    </html>`;
}
