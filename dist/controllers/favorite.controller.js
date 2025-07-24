var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { FavoriteModel, MovieModel } from "../models";
import { ErrorCode, sendResponse } from "../utils";
const getFavoritesByUserId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const favorites = yield FavoriteModel.findAll({
            where: {
                userId: req.user.id,
            },
            include: [MovieModel],
        });
        return sendResponse(res, {
            code: 200,
            status: "Success",
            data: favorites,
        });
    }
    catch (error) {
        next(error);
    }
});
const createFavorite = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { movieId } = req.params;
        const userId = req.user.id;
        const movie = yield MovieModel.findByPk(movieId);
        if (!movie) {
            return sendResponse(res, ErrorCode["movie-not-found"]);
        }
        const checkfavorite = yield FavoriteModel.findOne({
            where: {
                userId: req.user.id,
                movieId,
            },
        });
        if (checkfavorite) {
            console.log("dit me");
            sendResponse(res, {
                code: 400,
                status: "Error",
                message: "Vui lòng thử lại",
            });
            return;
        }
        const favorite = yield FavoriteModel.sync({ alter: true }).then(() => {
            return FavoriteModel.create({
                movieId,
                userId,
            });
        });
        sendResponse(res, {
            code: 201,
            status: "Success",
            data: favorite,
        });
    }
    catch (error) {
        next(error);
    }
});
const deleteFavorite = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { movieId } = req.params;
        const favorite = yield FavoriteModel.findOne({
            where: {
                userId: req.user.id,
                movieId,
            },
        });
        if (!favorite) {
            return sendResponse(res, ErrorCode["favorite-not-found"]);
        }
        favorite.destroy();
        return sendResponse(res, {
            code: 200,
            status: "Success",
            message: "Xoá yêu thích thành công.",
        });
    }
    catch (error) {
        next(error);
    }
});
const FavoriteController = {
    getFavoritesByUserId,
    createFavorite,
    deleteFavorite,
};
export default FavoriteController;
