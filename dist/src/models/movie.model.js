"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_1 = require("../config");
const utils_1 = require("../utils");
const MovieModel = config_1.connection.define(utils_1.TABLE_NAME.MOVIES, {
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    genre: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        get() {
            const value = this.getDataValue("genre");
            return value ? JSON.parse(value) : [];
        },
        set(value) {
            this.setDataValue("genre", JSON.stringify(value));
        },
    },
    director: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    releaseYear: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    duration: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    posterHorizontal: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    posterVertical: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    country: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    actors: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    videoURL: {
        type: sequelize_1.DataTypes.STRING,
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
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
});
exports.default = MovieModel;
