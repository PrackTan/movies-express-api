var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Op } from "sequelize";
import unidecode from "unidecode";
import { countryData, genreData } from "../data";
import { CommentModel, FavoriteModel, MovieModel, RatingModel, } from "../models";
import { sendResponse } from "../utils";
const createMovie = (req, res, next) => {
    try {
        const { title, description, genre, director, releaseYear, duration, posterHorizontal, posterVertical, country, actors, videoURL, trailerURL, } = req.body;
        const newGenre = typeof genre == "object" ? genre : [genre];
        const newVideoUrl = typeof videoURL == "object" ? videoURL : [videoURL];
        MovieModel.sync({ alter: true }).then(() => {
            return MovieModel.create({
                title,
                description,
                genre: newGenre,
                director,
                releaseYear,
                duration,
                posterHorizontal,
                posterVertical,
                country,
                actors,
                videoURL: newVideoUrl,
                trailerURL,
            });
        });
        return sendResponse(res, {
            code: 200,
            status: "Success",
            message: "Thêm phim thành công.",
        });
    }
    catch (error) {
        next(error);
    }
};
const updateMovie = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, genre, director, releaseYear, duration, posterHorizontal, posterVertical, country, actors, videoURL, trailerURL, } = req.body;
        const newVideoUrl = typeof videoURL == "object" ? videoURL : [videoURL];
        const newGenre = typeof genre == "object" ? genre : [genre];
        const { id } = req.params;
        const movie = yield MovieModel.findByPk(id);
        if (!movie) {
            return sendResponse(res, {
                code: 404,
                status: "Error",
                message: "Không tìm thấy phim.",
            });
        }
        const updateMovie = {
            title,
            description,
            director,
            releaseYear,
            duration,
            posterHorizontal,
            posterVertical,
            actors,
            trailerURL,
            genre: newGenre,
            videoURL: newVideoUrl,
        };
        movie.update(Object.assign({}, updateMovie));
        return sendResponse(res, {
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
        const movie = yield MovieModel.findByPk(id);
        if (!movie) {
            return sendResponse(res, {
                code: 400,
                status: "Error",
                message: "Không tìm thấy phim.",
            });
        }
        movie.destroy();
        return sendResponse(res, {
            code: 200,
            status: "Success",
            message: "Xoá phim thành công.",
        });
    }
    catch (error) { }
});
const getMovieById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const movie = yield MovieModel.findByPk(id);
        if (!movie) {
            return sendResponse(res, {
                code: 400,
                status: "Error",
                message: "Không tìm thấy phim.",
            });
        }
        const favorite = yield FavoriteModel.findOne({
            where: {
                userId: userId,
                movieId: id,
            },
        });
        console.log("trigger2");
        const ratings = yield RatingModel.findAll({
            where: {
                movieId: id,
            },
        });
        const sumRatings = ratings
            ? ratings.reduce((total, e) => total + e.rating, 0)
            : 0;
        const numberOfReviews = ratings ? ratings.length : 0;
        console.log(sumRatings);
        console.log(numberOfReviews);
        const numRating = sumRatings / numberOfReviews;
        const newGenre = movie.genre
            .split(", ")
            .map((id) => genreData.find((genre) => genre.code === id))
            .filter(Boolean)
            .map((genre) => genre === null || genre === void 0 ? void 0 : genre.name)
            .join(", ");
        const newCountry = (_a = countryData.find((e) => e.code === (movie === null || movie === void 0 ? void 0 : movie.country))) === null || _a === void 0 ? void 0 : _a.name;
        const newMovie = Object.assign(Object.assign({}, movie.toJSON()), { genre: newGenre, country: newCountry, numberOfReviews: numberOfReviews, rating: numRating ? numRating : 0, hasFavorite: !!favorite });
        return sendResponse(res, {
            code: 200,
            status: "Success",
            data: newMovie,
        });
    }
    catch (error) { }
});
const searchMovie = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { query } = req.params;
        const normalizedSearchQuery = unidecode(query);
        const movies = yield MovieModel.findAll({
            where: {
                title: {
                    [Op.like]: `%${normalizedSearchQuery.trim()}%`,
                },
            },
            attributes: { exclude: ["genre"] },
        });
        return sendResponse(res, {
            code: 200,
            status: "Success",
            data: movies,
        });
    }
    catch (error) {
        console.log(error);
    }
});
const recommendationsByMovieId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { movieId } = req.params;
        const movie = yield MovieModel.findByPk(movieId);
        const genre = movie === null || movie === void 0 ? void 0 : movie.genre;
        // const genreQuery = genre?.map((g) => `genre LIKE '%"${g}"%'`).join(" OR ");
        const recommendationMovies = yield MovieModel.findAll({
            where: {
                id: {
                    [Op.not]: movieId,
                },
                // [Op.or]: Sequelize.literal(genreQuery as string),
            },
            attributes: { exclude: ["genre"] },
        });
        return sendResponse(res, {
            code: 200,
            status: "Success",
            data: recommendationMovies,
        });
    }
    catch (error) {
        console.log(error);
    }
});
const getLatestMovies = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const movies = yield MovieModel.findAll({
            order: [["releaseYear", "DESC"]],
        });
        sendResponse(res, {
            code: 200,
            status: "Success",
            data: movies,
        });
    }
    catch (error) {
        next(error);
    }
});
const getMoviesByGenre = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { genreId } = req.params;
        const movies = yield MovieModel.findAll({
            where: {
                genre: {
                    [Op.like]: `%${genreId}%`,
                },
            },
        });
        sendResponse(res, {
            code: 200,
            status: "Success",
            data: movies,
        });
    }
    catch (error) {
        next(error);
    }
});
const getMoviesByCountry = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { countryId } = req.params;
        const movies = yield MovieModel.findAll({
            where: {
                country: countryId,
            },
        });
        sendResponse(res, {
            code: 200,
            status: "Success",
            data: movies,
        });
    }
    catch (error) {
        next(error);
    }
});
const getFavoriteMovies = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const movies = yield MovieModel.findAll({
            include: [
                {
                    model: FavoriteModel,
                    where: { userId },
                },
            ],
        });
        sendResponse(res, {
            code: 200,
            status: "Success",
            data: movies,
        });
    }
    catch (error) {
        next(error);
    }
});
const getCommentedMovies = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const movies = yield MovieModel.findAll({
            include: [
                {
                    model: CommentModel,
                    where: { userId },
                },
            ],
        });
        sendResponse(res, {
            code: 200,
            status: "Success",
            data: movies,
        });
    }
    catch (error) {
        next(error);
    }
});
const getRatedMovies = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const movies = yield MovieModel.findAll({
            include: [
                {
                    model: RatingModel,
                    where: { userId },
                },
            ],
        });
        sendResponse(res, {
            code: 200,
            status: "Success",
            data: movies,
        });
    }
    catch (error) {
        next(error);
    }
});
const MovieController = {
    createMovie,
    updateMovie,
    deleteMovie,
    getMovieById,
    searchMovie,
    recommendationsByMovieId,
    getLatestMovies,
    getMoviesByGenre,
    getMoviesByCountry,
    getFavoriteMovies,
    getCommentedMovies,
    getRatedMovies,
};
export default MovieController;
