"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const schema = [
    (0, express_validator_1.body)("email").isEmail().withMessage("Email không hợp lệ."),
    (0, express_validator_1.body)("password")
        .notEmpty()
        .withMessage("Mật khẩu không được để trống.")
        .isLength({ min: 6, max: 20 })
        .withMessage("Mật khẩu phải có từ 6 đến 20 ký tự."),
];
exports.default = schema;
