"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendResponse = (res, result) => {
    const response = Object.assign({}, result);
    res.status(200).json(response);
};
exports.default = sendResponse;
