"use strict";

const {Model} = require("sequelize");
const {signBcrypt} = require("../helpers/bcryptjs");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Transaction, {
        foreignKey: "UserId",
      });
    }
  }
  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {msg: "Username must be required"},
          notNull: {msg: "Username must be required"},
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: "Email must be unique",
        },
        validate: {
          notEmpty: {msg: "Email must be required"},
          notNull: {msg: "Email must be required"},
          isEmail: {msg: "Email must be valid"},
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {msg: "Password must be required"},
          notNull: {msg: "Password must be required"},
          len: {
            args: [5, 20],
            msg: "Password must be between 5 and 20 characters",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  User.beforeCreate((user) => {
    user.password = signBcrypt(user.password);
  });
  return User;
};
