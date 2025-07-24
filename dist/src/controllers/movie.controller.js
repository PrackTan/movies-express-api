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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const unidecode_1 = __importDefault(require("unidecode"));
const models_1 = require("../models");
const utils_1 = require("../utils");
const createMovie = (req, res, next) => {
    try {
        const { title, description, genre, director, releaseYear, duration, posterHorizontal, posterVertical, country, actors, videoURL, trailerURL, } = req.body;
        models_1.MovieModel.sync({ alter: true }).then(() => {
            return models_1.MovieModel.create({
                title,
                description,
                genre,
                director,
                releaseYear,
                duration,
                posterHorizontal,
                posterVertical,
                country,
                actors,
                videoURL,
                trailerURL,
            });
        });
        return (0, utils_1.sendResponse)(res, {
            code: 200,
            status: "Success",
            message: "Thêm phim thành công.",
        });
    }
    catch (error) { }
};
const updateMovie = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const movie = yield models_1.MovieModel.findByPk(id);
        if (!movie) {
            return (0, utils_1.sendResponse)(res, {
                code: 404,
                status: "Error",
                message: "Không tìm thấy phim.",
            });
        }
        const updateMovie = {};
        movie.update(Object.assign({}, updateMovie));
        return (0, utils_1.sendResponse)(res, {
            code: 200,
            status: "Success",
            data: movie,
        });
    }
    catch (error) { }
});
const deleteMovie = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const movie = yield models_1.MovieModel.findByPk(id);
        if (!movie) {
            return (0, utils_1.sendResponse)(res, {
                code: 400,
                status: "Error",
                message: "Không tìm thấy phim.",
            });
        }
        movie.destroy();
        return (0, utils_1.sendResponse)(res, {
            code: 200,
            status: "Success",
            message: "Xoá phim thành công.",
        });
    }
    catch (error) { }
});
const getMovieById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const movie = yield models_1.MovieModel.findByPk(id);
        if (!movie) {
            return (0, utils_1.sendResponse)(res, {
                code: 400,
                status: "Error",
                message: "Không tìm thấy phim.",
            });
        }
        return (0, utils_1.sendResponse)(res, {
            code: 200,
            status: "Success",
            data: movie,
        });
    }
    catch (error) { }
});
const searchMovie = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { query } = req.body;
        const normalizedSearchQuery = (0, unidecode_1.default)(query);
        const movies = yield models_1.MovieModel.findAll({
            where: {
                title: {
                    [sequelize_1.Op.like]: `%${normalizedSearchQuery.trim()}%`,
                },
            },
        });
        return (0, utils_1.sendResponse)(res, {
            code: 200,
            status: "Success",
            data: movies,
        });
    }
    catch (error) {
        console.log(error);
    }
});
const MovieController = {
    createMovie,
    updateMovie,
    deleteMovie,
    getMovieById,
    searchMovie,
};
exports.default = MovieController;
