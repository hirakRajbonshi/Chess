import { Request, Response } from "express";
import { User } from "../models/user.models";
import { ApiResponse } from "../utils/ApiRespones";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken";

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

const generateAccessTokenAndRefreshToken = async (
  userId: string
): Promise<Tokens | null> => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      console.error("User not found");
      return null;
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (err) {
    console.error("Error generating tokens:", err);
    return null;
  }
};

const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, username, email, password } = req.body;
    //TODO: validation
    const exist = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (exist) {
      res.status(400).json({ msg: "User already exists" });
      return;
    }

    //TODO: avatar uploading in cloudinary

    const user = await User.create({
      name,
      username,
      email,
      password,
      avatar: "abc",
    });

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    if (!createdUser) {
      res.status(500).json({ msg: "Could not register user" });
      return;
    }
    res
      .status(200)
      .json(new ApiResponse(201, createdUser, "User registered Successfully"));
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ msg: "Something went wrong" });
  }
};
interface LoginRequestBody {
  username?: string;
  email?: string;
  password: string;
}
const loginUser = async (
  req: Request<{}, {}, LoginRequestBody>,
  res: Response
): Promise<void> => {
  try {
    const { username, email, password } = req.body;
    if (!username && !email) {
      res.status(400).json({ msg: "Username or email is required" });
    }
    if (!password) {
      res.status(400).json({ msg: "Password is required" });
    }
    const user = await User.findOne({ $or: [{ username }, { email }] });
    if (!user || !(await user.isPasswodCorrect(password))) {
      res.status(401).json({ msg: "Invalid credentials" });
      return;
    }
    const tokens = await generateAccessTokenAndRefreshToken(
      user._id.toString()
    );
    if (!tokens) {
      res.status(500).json({ msg: "Could not generate tokens" });
      return;
    }
    const { accessToken, refreshToken } = tokens;
    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );
    const options = {
      httpOnly: true,
      secure: true,
    };

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    res.status(200).json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged In Successfully"
      )
    );
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ msg: "Something went wrong" });
  }
};
const logoutUser = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ msg: "Unauthorized" });
      return;
    }

    await User.findByIdAndUpdate(
      req.user._id,
      { $set: { refreshToken: "" } },
      { new: true }
    );

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };

    res.clearCookie("refreshToken", options);
    res.clearCookie("accessToken", options);

    res
      .status(200)
      .json(new ApiResponse(200, {}, "User logged out successfully"));
  } catch (error) {
    console.error("Error logging out:", error);
    res.status(500).json({ msg: "Something went wrong" });
  }
};

const refreshAccessToken = async (req: Request, res: Response) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    res.status(401).json({ msg: "Refresh token is required" });
  }

  try {
    interface DecodedToken {
      _id: string;
    }
    const decoded = jwt.verify(incomingRefreshToken, "shhhhh") as DecodedToken; //TODO: .env
    const user = await User.findById(decoded?._id);

    if (!user || user.refreshToken !== incomingRefreshToken) {
      return res.status(403).json({ msg: "Invalid refresh token" });
    }

    const tokens = await generateAccessTokenAndRefreshToken(
      user._id.toString()
    );
    if (!tokens) {
      return res.status(500).json({ msg: "Could not generate tokens" });
    }
    const { accessToken, refreshToken } = tokens;

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { accessToken },
          "Access token refreshed successfully"
        )
      );
  } catch (err) {
    res.status(500).json({ msg: "Something went wrong" });
  }
};

export { registerUser, loginUser, logoutUser };
