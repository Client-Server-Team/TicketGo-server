const {verifyBcrypt} = require("../helpers/bcryptjs");
const {signToken} = require("../helpers/jwt");
const {User} = require("../models");

class UserController {
  static async register(req, res, next) {
    try {
      let {username, email, password} = req.body;
      let newUser = await User.create({
        username,
        email,
        password,
      });
      res.status(201).json({
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      });
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        next({name: "BadRequest", message: "Email already registered"});
      } else {
        next(error);
      }
    }
  }

  static async login(req, res, next) {
    try {
      let {email, password} = req.body;
      if (!email) {
        throw {name: "BadRequest", message: "Email is required"};
      }
      if (!password) {
        throw {name: "BadRequest", message: "Password is required"};
      }
      let user = await User.findOne({where: {email}});
      if (!user) {
        throw {name: "Unauthorized", message: "Invalid email/password"};
      }
      let isValidPassword = verifyBcrypt(password, user.password);
      if (!isValidPassword) {
        throw {name: "Unauthorized", message: "Invalid email/password"};
      }
      let access_token = signToken({id: user.id, email: user.email});
      res.status(200).json({access_token, email: user.email});
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
