import { countryData } from "../data";
import { sendResponse } from "../utils";
const getCountries = (req, res) => {
    try {
        return sendResponse(res, {
            code: 200,
            status: "Success",
            message: "",
            data: countryData,
        });
    }
    catch (error) { }
};
const CountryController = {
    getCountries,
};
export default CountryController;
