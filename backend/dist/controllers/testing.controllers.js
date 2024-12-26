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
Object.defineProperty(exports, "__esModule", { value: true });
const ApiRespones_1 = require("../utils/ApiRespones");
// const testing = asyncHandler(async (req: Request, res: Response) => {
//   res.status(200).json(new ApiResponse(200, "OK", "Testing passed"));
// });
const testing = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).json(new ApiRespones_1.ApiResponse(200, "OK", "Testing passed"));
    }
    catch (err) {
        res.status(400).send(err);
    }
});
exports.default = testing;
