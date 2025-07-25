var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { MovieModel, RatingModel } from "../models";
import { ErrorCode, sendResponse } from "../utils";
const getRatingByMovie = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { movieId } = req.params;
        const movie = yield MovieModel.findByPk(movieId);
        if (!movie) {
            return sendResponse(res, ErrorCode["movie-not-found"]);
        }
        const rating = yield RatingModel.findOne({
            where: {
                movieId,
                userId: req.user.id,
            },
        });
        return sendResponse(res, {
            code: 200,
            status: "Success",
            data: rating,
        });
    }
    catch (error) {
        next(error);
    }
});
// const getRatingByUserId: RequestHandler<
//   unknown,
//   ResponseResult<Array<Favorite> | undefined>,
//   unknown,
//   unknown
// > = async (req, res, next) => {
//   try {
//     const ratings = await RatingModel.findAll({
//       where: {
//         userId: req.user.id,
//       },
//     });
//     return sendResponse(res, {
//       code: 200,
//       status: "Success",
//       data: ratings,
//     });
//   } catch (error) {
//     next(error);
//   }
// };
const rateMovie = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { movieId } = req.params;
        const { rating } = req.body;
        const userId = req.user.id;
        const movie = yield MovieModel.findByPk(movieId);
        if (!movie) {
            return sendResponse(res, ErrorCode["movie-not-found"]);
        }
        const ratingFound = yield RatingModel.findOne({
            where: {
                userId: userId,
                movieId: movieId,
            },
        });
        if (ratingFound) {
            ratingFound.update({
                rating,
            });
            return sendResponse(res, {
                code: 200,
                status: "Success",
                message: "Cập nhật đánh giá thành công.",
            });
        }
        const ratingRecord = yield RatingModel.sync({ alter: true }).then(() => {
            return RatingModel.create({
                movieId,
                userId: userId,
                rating,
            });
        });
        sendResponse(res, {
            code: 201,
            status: "Success",
            data: ratingRecord,
        });
    }
    catch (error) {
        next(error);
    }
});
// const updateRating: RequestHandler<
//   UpdateRatingParams,
//   ResponseResult<undefined>,
//   UpdateRatingBody,
//   unknown
// > = async (req, res, next) => {
//   try {
//     const { ratingId } = req.params;
//     const { rating } = req.body;
//     const ratingFound = await RatingModel.findByPk(ratingId);
//     if (!ratingFound) {
//       return sendResponse(res, ErrorCode["favorite-not-found"]);
//     }
//     ratingFound.update({
//       rating,
//     });
//     return sendResponse(res, {
//       code: 200,
//       status: "Success",
//       message: "Cập nhật đánh giá thành công.",
//     });
//   } catch (error) {
//     next(error);
//   }
// };
const RatingController = {
    getRatingByMovie,
    // getRatingByUserId,
    rateMovie,
    // updateRating,
};
export default RatingController;
