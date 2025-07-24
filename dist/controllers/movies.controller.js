"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const utils_1 = require("../utils");
const createMovie = (req, res) => {
    try {
        const { title, description, genre, director, releaseYear, duration, poster, country, actors, videoURL, } = req.body;
        models_1.MovieModel.sync({ alter: true }).then(() => {
            return models_1.MovieModel.create({
                title,
                description,
                genre,
                director,
                releaseYear,
                duration,
                poster,
                country,
                actors,
                videoURL,
            });
        });
        return (0, utils_1.sendResponse)(res, 200, {
            code: 200,
            status: "Success",
            message: "Thêm phim thành công.",
        });
    }
    catch (error) { }
};
const MovieController = {
    createMovie,
};
exports.default = MovieController;
