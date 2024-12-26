import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { User } from "../models/user.models";

declare module "express-serve-static-core" {
  interface Request {
    user?: any;
  }
}

export const verifyJWT = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      _res.status(401).json({ msg: "Unauthorized: Invalid token format" });
      return;
    }
    const token = authHeader.split(" ")[1];

    if (!token) {
      _res.status(401).json({ msg: "Unauthorized" });
      return;
    }
    try {
      const decodedToken = jwt.verify(token, "shhhhh") as { _id: string }; //TODO: .env
      const user = await User.findById(decodedToken?._id).select(
        "-password -refreshToken"
      );

      if (!user) {
        _res.status(401).json({ msg: "Unauthorized" });
        return;
      }
      req.user = user;
      return next();
    } catch {
      _res.status(401).json({ msg: "Unauthorized tc" });
    }
  } catch (error) {
    console.error("Error in verifyJWT middleware:", error);
    _res.status(500).json({ msg: "Internal server error" });
  }
};
