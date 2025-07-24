"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const validator_1 = __importDefault(require("validator"));
const schema = [
    (0, express_validator_1.body)("name").notEmpty().withMessage("Tên không được để trống."),
    (0, express_validator_1.body)("email").isEmail().withMessage("Email không hợp lệ."),
    (0, express_validator_1.body)("password")
        .notEmpty()
        .withMessage("Mật khẩu không được để trống")
        .isLength({ min: 6, max: 20 })
        .withMessage("Mật khẩu phải có từ 6 đến 20 ký tự."),
    (0, express_validator_1.body)("birthday")
        .notEmpty()
        .withMessage("Ngày sinh không được để trống.")
        .custom((value) => {
        if (!validator_1.default.isDate(value)) {
            throw new Error("Ngày sinh không hợp lệ.");
        }
        return true;
    }),
];
exports.default = schema;
