"use strict";
const {Model} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Ticket extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Transaction, {
        foreignKey: "TicketId",
      });
    }
  }
  Ticket.init(
    {
      name: DataTypes.STRING,
      imageUrl: DataTypes.TEXT,
      description: DataTypes.TEXT,
      quantity: DataTypes.INTEGER,
      price: DataTypes.INTEGER,
      date: DataTypes.DATE,
      location: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Ticket",
    }
  );
  return Ticket;
};
