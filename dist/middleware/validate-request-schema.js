"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const validateRequestSchema = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(200).json({
            code: 400,
            status: "Error",
            message: errors.array(),
        });
    }
    next();
};
exports.default = validateRequestSchema;
