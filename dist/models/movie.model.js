import { DataTypes } from "sequelize";
import { connection } from "../config";
import { TABLE_NAME } from "../utils";
const MovieModel = connection.define(TABLE_NAME.MOVIES, {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    genre: {
        type: DataTypes.TEXT,
        allowNull: false,
        // get() {
        //   const value: any = this.getDataValue("genre");
        //   return value ? value : [];
        // },
        set(value) {
            this.setDataValue("genre", value.join(", "));
        },
    },
    director: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    releaseYear: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    posterHorizontal: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    posterVertical: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    country: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    actors: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    videoURL: {
        type: DataTypes.TEXT,
        allowNull: false,
        get() {
            const value = this.getDataValue("videoURL");
            return value ? JSON.parse(value) : [];
        },
        set(value) {
            this.setDataValue("videoURL", JSON.stringify(value));
        },
    },
    trailerURL: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
});
export default MovieModel;
