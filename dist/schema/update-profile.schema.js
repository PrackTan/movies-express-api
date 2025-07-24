"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const validator_1 = __importDefault(require("validator"));
const schema = [
    (0, express_validator_1.body)("birthday")
        .optional()
        .custom((value) => {
        if (!validator_1.default.isDate(value)) {
            throw new Error("Ngày sinh không hợp lệ.");
        }
        return true;
    }),
];
exports.default = schema;
