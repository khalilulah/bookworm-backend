import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.model.js";

dotenv.config();

export const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(400).json({ message: "provide a token" });
    }

    // return
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decode);

    if (!decode) {
      return res.status(400).json({ message: "invalid token" });
    }

    //get  the details od the user with the id (decode.userId)
    const getUser = await User.findById(decode.userId).select("-password");

    if (!getUser) {
      return res.status(400).json({ message: "not a valid user" });
    }

    req.user = getUser;

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
