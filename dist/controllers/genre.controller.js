import { genreData } from "../data";
import { sendResponse } from "../utils";
const getGenres = (req, res) => {
    try {
        return sendResponse(res, {
            code: 200,
            status: "Success",
            message: "",
            data: genreData,
        });
    }
    catch (error) { }
};
const GenreController = {
    getGenres,
};
export default GenreController;
