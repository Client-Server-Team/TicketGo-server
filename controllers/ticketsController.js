const {Ticket} = require("../models");
const {generateContent} = require("../helpers/gemini");
const {Op} = require("sequelize");

class TicketsController {
  static async getAllTickets(req, res, next) {
    try {
      const tickets = await Ticket.findAll();
      return res.status(200).json(tickets);
    } catch (error) {
      next(error);
    }
  }
  static async getTicketById(req, res, next) {
    try {
      const ticketsId = req.params.id;
      const tickets = await Ticket.findByPk(ticketsId);
      if (!tickets) {
        throw {
          name: "NotFound",
          message: `Country with id ${ticketsId} not found`,
        };
      }
      res.status(200).json(tickets);
    } catch (error) {
      next(error);
    }
  }
  static async getTicketSummary(req, res, next) {
    try {
      const ticketId = req.params.id;
      const ticket = await Ticket.findByPk(ticketId);

      if (!ticket) {
        throw {
          name: "NotFound",
          message: `Ticket with id ${ticketId} not found`,
        };
      }

      const otherTickets = await Ticket.findAll({
        where: {
          [Op.and]: [{genre: ticket.genre}, {id: {[Op.ne]: ticketId}}],
        },
      });

      const otherDescriptions = otherTickets
        .map((t) => `- ${t.name}: ${t.description}`)
        .join("\n");

      const prompt = `Berdasarkan genre konser "${ticket.genre}", berikut adalah rekomendasi konser lain dengan genre yang sama:\n${otherDescriptions}\n\nBerikan rekomendasi aktivitas atau tips untuk penonton konser "${ticket.name}":\n${ticket.description}`;

      const recommendation = await generateContent(prompt);
      const prompt_global = `

        Berdasarkan genre konser "${ticket.genre}", 
        Berikan rekomendasi 1 konser lain dengan genre yang sama dalam bentuk json seperti berikut

        {
          name : 'nama dari konser',
          genre : 'genre dari konser',
          imageUrl : 'url image dari konser',
          description : 'deskripsi dari konser tersebut',
          quantity : 'quantity penonton dari konser tersebut',
          date : 'date dari konser akan berlangsung dengan format seperti berikut 2025-05-07T03:31:19.331Z'
          location: 'Coming Soon'
        }

      `;

      let resGlobal = await generateContent(prompt_global);
      resGlobal = JSON.parse(
        resGlobal.replace("```json", "").replace("```", "")
      );
      // res.status(200).json({
      //   resGlobal
      // });

      otherTickets.push(resGlobal);

      res.status(200).json({
        ticket: ticket,
        recommendation,
        otherTickets,
      });
    } catch (error) {
      next(error);
    }
  }
}
module.exports = TicketsController;
