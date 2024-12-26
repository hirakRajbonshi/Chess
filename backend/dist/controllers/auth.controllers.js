"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutUser = exports.loginUser = exports.registerUser = void 0;
const user_models_1 = require("../models/user.models");
const ApiRespones_1 = require("../utils/ApiRespones");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateAccessTokenAndRefreshToken = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_models_1.User.findById(userId);
        if (!user) {
            console.error("User not found");
            return null;
        }
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        yield user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    }
    catch (err) {
        console.error("Error generating tokens:", err);
        return null;
    }
});
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, username, email, password } = req.body;
        //TODO: validation
        const exist = yield user_models_1.User.findOne({
            $or: [{ username }, { email }],
        });
        if (exist) {
            res.status(400).json({ msg: "User already exists" });
            return;
        }
        //TODO: avatar uploading in cloudinary
        const user = yield user_models_1.User.create({
            name,
            username,
            email,
            password,
            avatar: "abc",
        });
        const createdUser = yield user_models_1.User.findById(user._id).select("-password -refreshToken");
        if (!createdUser) {
            res.status(500).json({ msg: "Could not register user" });
            return;
        }
        res
            .status(200)
            .json(new ApiRespones_1.ApiResponse(201, createdUser, "User registered Successfully"));
    }
    catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ msg: "Something went wrong" });
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password } = req.body;
        if (!username && !email) {
            res.status(400).json({ msg: "Username or email is required" });
        }
        if (!password) {
            res.status(400).json({ msg: "Password is required" });
        }
        const user = yield user_models_1.User.findOne({ $or: [{ username }, { email }] });
        if (!user || !(yield user.isPasswodCorrect(password))) {
            res.status(401).json({ msg: "Invalid credentials" });
            return;
        }
        const tokens = yield generateAccessTokenAndRefreshToken(user._id.toString());
        if (!tokens) {
            res.status(500).json({ msg: "Could not generate tokens" });
            return;
        }
        const { accessToken, refreshToken } = tokens;
        const loggedInUser = yield user_models_1.User.findById(user._id).select("-password -refreshToken");
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
        res.status(200).json(new ApiRespones_1.ApiResponse(200, {
            user: loggedInUser,
            accessToken,
            refreshToken,
        }, "User logged In Successfully"));
    }
    catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ msg: "Something went wrong" });
    }
});
exports.loginUser = loginUser;
const logoutUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(401).json({ msg: "Unauthorized" });
            return;
        }
        yield user_models_1.User.findByIdAndUpdate(req.user._id, { $set: { refreshToken: "" } }, { new: true });
        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        };
        res.clearCookie("refreshToken", options);
        res.clearCookie("accessToken", options);
        res
            .status(200)
            .json(new ApiRespones_1.ApiResponse(200, {}, "User logged out successfully"));
    }
    catch (error) {
        console.error("Error logging out:", error);
        res.status(500).json({ msg: "Something went wrong" });
    }
});
exports.logoutUser = logoutUser;
const refreshAccessToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!incomingRefreshToken) {
        res.status(401).json({ msg: "Refresh token is required" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(incomingRefreshToken, "shhhhh"); //TODO: .env
        const user = yield user_models_1.User.findById(decoded === null || decoded === void 0 ? void 0 : decoded._id);
        if (!user || user.refreshToken !== incomingRefreshToken) {
            return res.status(403).json({ msg: "Invalid refresh token" });
        }
        const tokens = yield generateAccessTokenAndRefreshToken(user._id.toString());
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
            .json(new ApiRespones_1.ApiResponse(200, { accessToken }, "Access token refreshed successfully"));
    }
    catch (err) {
        res.status(500).json({ msg: "Something went wrong" });
    }
});
