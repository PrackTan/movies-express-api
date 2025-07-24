import { DataTypes } from "sequelize";
import { connection } from "../config";
import { TABLE_NAME } from "../utils";
const CommentModel = connection.define(TABLE_NAME.COMMENTS, {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    comment: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});
export default CommentModel;
