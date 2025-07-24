import { DataTypes } from "sequelize";
import { connection } from "../config";
import { TABLE_NAME } from "../utils";
const FavoriteModel = connection.define(TABLE_NAME.FAVORITES, {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
});
export default FavoriteModel;
