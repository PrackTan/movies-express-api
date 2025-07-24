import * as dotenv from "dotenv";
dotenv.config();
export var TABLE_NAME;
(function (TABLE_NAME) {
    TABLE_NAME["USERS"] = "users";
    TABLE_NAME["MOVIES"] = "movies";
    TABLE_NAME["COMMENTS"] = "comments";
    TABLE_NAME["FAVORITES"] = "favorites";
    TABLE_NAME["RATINGS"] = "ratings";
})(TABLE_NAME || (TABLE_NAME = {}));
export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
