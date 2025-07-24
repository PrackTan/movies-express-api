import * as yup from "yup";
// Get rating by movie ID
export const getRatingByMovieSchema = yup.object({
    params: yup.object({
        movieId: yup.number().required(),
    }),
});
// Create a rating
export const createRatingSchema = yup.object({
    params: yup.object({
        movieId: yup.number().required(),
    }),
    body: yup.object({
        rating: yup.number().required(),
    }),
});
// Update a rating
export const updateRatingSchema = yup.object({
    params: yup.object({
        ratingId: yup.number().required(),
    }),
    body: yup.object({
        rating: yup.number().required(),
    }),
});
