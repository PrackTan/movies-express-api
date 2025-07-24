import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../utils";
const generateToken = (user) => {
    return jwt.sign({ id: user.id }, JWT_SECRET_KEY, {
        expiresIn: 100 * 60000,
    });
};
export default generateToken;
