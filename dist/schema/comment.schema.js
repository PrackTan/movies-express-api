import * as yup from "yup";
// Get comment by its ID
export const getCommentByIdSchema = yup.object({
    params: yup.object({
        commentId: yup.number().required(),
    }),
});
// Get comment by movie ID
export const getCommentByMovieSchema = yup.object({
    params: yup.object({
        movieId: yup.number().required(),
    }),
});
// Create a new comment
export const createCommentSchema = yup.object({
    params: yup.object({
        movieId: yup.number().required(),
    }),
    body: yup.object({
        comment: yup.string().required(),
    }),
});
// Update a comment
export const updateCommentSchema = yup.object({
    params: yup.object({
        commentId: yup.number().required(),
    }),
    body: yup.object({
        comment: yup.string().required(),
    }),
});
// Delete a comment
export const deleteCommentSchema = yup.object({
    params: yup.object({
        commentId: yup.number().required(),
    }),
});
