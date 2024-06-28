const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("cop4710", "postgres", "yankees", {
  host: "localhost",
  dialect: "postgres",
});

module.exports = sequelize;
