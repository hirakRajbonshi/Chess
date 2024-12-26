"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const testing_controllers_1 = __importDefault(require("../controllers/testing.controllers"));
const router = (0, express_1.Router)();
router.route("/").get(testing_controllers_1.default);
exports.default = router;
