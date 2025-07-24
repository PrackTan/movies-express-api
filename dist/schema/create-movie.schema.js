"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const schema = [
    (0, express_validator_1.body)("title").notEmpty().withMessage("Tiêu đề không được bỏ trống."),
    (0, express_validator_1.body)("description").notEmpty().withMessage("Mô tả không được bỏ trống."),
    (0, express_validator_1.body)("genre").isArray().withMessage("Thể loại phải là một mảng."),
    (0, express_validator_1.body)("director").notEmpty().withMessage("Đạo diễn không được bỏ trống."),
    (0, express_validator_1.body)("releaseYear")
        .notEmpty()
        .withMessage("Năm phát hành không được bỏ trống."),
    (0, express_validator_1.body)("duration").isInt().withMessage("Thời lượng phải là một số nguyên."),
    (0, express_validator_1.body)("poster").notEmpty().withMessage("Đường dẫn ảnh không được bỏ trống."),
    (0, express_validator_1.body)("country").notEmpty().withMessage("Quốc gia không được bỏ trống."),
    (0, express_validator_1.body)("actors").isArray().withMessage("Diễn viên phải là một mảng."),
    (0, express_validator_1.body)("videoURL")
        .notEmpty()
        .withMessage("Đường dẫn video không được bỏ trống."),
];
exports.default = schema;
