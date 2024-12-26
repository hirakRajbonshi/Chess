import { Request, Response } from "express";
import { ApiResponse } from "../utils/ApiRespones";
import { asyncHandler } from "../utils/asyncHandler";

// const testing = asyncHandler(async (req: Request, res: Response) => {
//   res.status(200).json(new ApiResponse(200, "OK", "Testing passed"));
// });
const testing = async (req: Request, res: Response) => {
  try {
    res.status(200).json(new ApiResponse(200, "OK", "Testing passed"));
  } catch (err) {
    res.status(400).send(err);
  }
};

export default testing;
