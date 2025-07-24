var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { CommentModel, MovieModel, UserModel } from "../models";
import { ErrorCode, sendResponse } from "../utils";
const getCommentById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { commentId } = req.params;
        const comment = yield CommentModel.findByPk(commentId, {
            include: [UserModel, MovieModel],
        });
        if (!comment) {
            return sendResponse(res, ErrorCode["comment-not-found"]);
        }
        return sendResponse(res, {
            code: 200,
            status: "Success",
            data: comment,
        });
    }
    catch (error) {
        next(error);
    }
});
const getCommentsByMovie = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { movieId } = req.params;
        const movie = yield MovieModel.findByPk(movieId);
        if (!movie) {
            return sendResponse(res, ErrorCode["movie-not-found"]);
        }
        const comments = yield CommentModel.findAll({
            where: {
                movieId,
            },
            include: [UserModel],
        });
        return sendResponse(res, {
            code: 200,
            status: "Success",
            data: comments,
        });
    }
    catch (error) {
        next(error);
    }
});
const getCommentsByUserId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const comments = yield CommentModel.findAll({
            where: {
                userId: req.user.id,
            },
            include: [MovieModel],
        });
        return sendResponse(res, {
            code: 200,
            status: "Success",
            data: comments,
        });
    }
    catch (error) {
        next(error);
    }
});
const createComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { movieId } = req.params;
        const { comment } = req.body;
        const userId = req.user.id;
        const movie = yield MovieModel.findByPk(movieId);
        if (!movie) {
            return sendResponse(res, ErrorCode["movie-not-found"]);
        }
        const newComment = yield CommentModel.sync({ alter: true }).then(() => {
            return CommentModel.create({
                comment,
                movieId,
                userId,
            });
        });
        sendResponse(res, {
            code: 201,
            status: "Success",
            data: newComment,
        });
    }
    catch (error) {
        next(error);
    }
});
const updateComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { commentId } = req.params;
        const { comment } = req.body;
        const data = yield CommentModel.findByPk(commentId);
        if (!data) {
            return sendResponse(res, ErrorCode["comment-not-found"]);
        }
        data.update({
            comment: comment,
        });
        return sendResponse(res, {
            code: 200,
            status: "Success",
            message: "Cập nhật bình luận thành công.",
        });
    }
    catch (error) {
        next(error);
    }
});
const deleteComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { commentId } = req.params;
        const data = yield CommentModel.findByPk(commentId);
        if (!data) {
            return sendResponse(res, ErrorCode["comment-not-found"]);
        }
        data.destroy();
        return sendResponse(res, {
            code: 204,
            status: "Success",
            message: "Xoá bình luận thành công.",
        });
    }
    catch (error) {
        next(error);
    }
});
const CommentController = {
    getCommentById,
    getCommentsByMovie,
    getCommentsByUserId,
    createComment,
    updateComment,
    deleteComment,
};
export default CommentController;
