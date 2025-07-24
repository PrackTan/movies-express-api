import { DataTypes } from "sequelize";
import { connection } from "../config";
import { TABLE_NAME } from "../utils";
const RatingModel = connection.define(TABLE_NAME.RATINGS, {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});
export default RatingModel;
