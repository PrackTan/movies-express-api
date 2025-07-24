"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const movieNotFoundException = (res) => {
    return (0, utils_1.sendResponse)(res, 200, {
        code: 404,
        status: "Error",
        message: "Movie not found.",
    });
};
exports.default = movieNotFoundException;
