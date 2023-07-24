import dotenv from "dotenv";
import { jwtVerify } from "jose";

dotenv.config();

const jwtValidate = async (req, res, next) => {
  let key = process.env.KEY;
  let cookie = req.cookies["auth"];
  try {
    let encoder = new TextEncoder();
    let jwtaccess = await jwtVerify(cookie, encoder.encode(key));
    req.user = jwtaccess;
    next();
  } catch (err) {
    res.clearCookie("auth")
    res.send({ status: 401, message: "Token invalido" });
  }
};

export default jwtValidate;