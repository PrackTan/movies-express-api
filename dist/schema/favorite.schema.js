import * as yup from "yup";
// Create a favorite
export const createFavoriteSchema = yup.object({
    params: yup.object({
        movieId: yup.number().required(),
    }),
});
// Delete a favorite
export const deleteFavoriteSchema = yup.object({
    params: yup.object({
        movieId: yup.number().required(),
    }),
});
