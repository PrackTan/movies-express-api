import { Sequelize } from "sequelize";

const connection = new Sequelize({
  host: "localhost",
  dialect: "postgres",
  username: "postgres", // Đổi lại user nếu cần
  password: "", // Đổi lại password nếu cần
  database: "real_film",
  logging: false,
});

connection
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database: ", error);
  });

export default connection;
