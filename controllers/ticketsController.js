const {Ticket} = require("../models");

class TicketsController {
  static async getAllTickets(req, res, next) {
    try {
      const tickets = await Ticket.findAll();
      return res.status(200).json(tickets);
    } catch (error) {
      next(error);
    }
  }
}
module.exports = TicketsController;
