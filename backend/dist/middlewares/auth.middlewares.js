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
exports.verifyJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_models_1 = require("../models/user.models");
const verifyJWT = (req, _res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
            const decodedToken = jsonwebtoken_1.default.verify(token, "shhhhh"); //TODO: .env
            console.log(decodedToken);
            const user = yield user_models_1.User.findById(decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken._id).select("-password -refreshToken");
            if (!user) {
                _res.status(401).json({ msg: "Unauthorized" });
                return;
            }
            req.user = user;
            return next();
        }
        catch (_a) {
            _res.status(401).json({ msg: "Unauthorized tc" });
        }
    }
    catch (error) {
        console.error("Error in verifyJWT middleware:", error);
        _res.status(500).json({ msg: "Internal server error" });
    }
});
exports.verifyJWT = verifyJWT;
