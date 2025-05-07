const {Ticket} = require("../models");

const authorization = async (req, res, next) => {
  try {

    const {id} = req.params
    const trans = await Transaction.findByPk(id);

    if (!trans) {
      throw {name: "NotFound", message: `Transaction with id ${id} not found`};
    }

    if (trans.UserId !== req.user.id) {
      throw {name : 'Forbidden', message : `You're not authorized`}
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authorization;
