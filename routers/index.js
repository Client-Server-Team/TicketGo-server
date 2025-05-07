const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");
const TicketsController = require("../controllers/ticketsController");
// const TransactionsController = require("../controllers/transactionsController");
// const authorization = require("../middlewares/authorization");
const authenticate = require("../middlewares/authentication");
const errorHandler = require("../middlewares/errorHandler");
const TransactionsController = require("../controllers/transactionsController");
const authorization = require("../middlewares/authorization");

// add routers here
router.post("/register", UserController.register);
router.post("/login", UserController.login);

router.get("/tickets", TicketsController.getAllTickets);
router.get("/tickets/:id", authenticate, TicketsController.getTicketById);
router.get("/tickets/:id/summary", authenticate, TicketsController.getTicketSummary);

router.get("/myticket", authenticate,TransactionsController.getTransactionByUserId)
router.post("/myticket/:id", authenticate, authorization,TransactionsController.buyTicket)

router.use(errorHandler);

module.exports = router;
