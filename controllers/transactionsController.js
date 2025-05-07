const {Transaction, Ticket, User} = require("../models");

class TransactionsController {
    static async getTransactionByUserId (req,res,next) {
        try {
            const {id} = req.user
            
            const data = await Transaction.findOne({
                where : {
                    UserId : +id
                },
                include : [
                    {
                        model : Ticket
                    },
                    {
                        model : User,
                        attributes : ['username','email']
                    }
                ]
            })

            res.status(200).json(data)

        } catch (error) {
            next(error)
        }
    }

    static async buyTicket (req,res,next) {
        try {

            const {totalPrice, totalQuantity} = req.body
            const {id : ticketId} = req.params

            const {id : userId} = req.user
            

            if (!ticketId) {
                throw {name : 'NotFound', message : 'Ticket not found'}
            }
            if (!totalPrice) {
                throw {name : 'NotFound', message : 'Total price not found'}
            }
            if (!totalQuantity) {
                throw {name : 'NotFound', message : 'Total quantity not found'}
            }

            const newBody = {
                UserId : +userId,
                TicketId : +ticketId,
                totalPrice : +totalPrice,
                totalQuantity : +totalQuantity
            }

            const data = await Transaction.create(newBody)
            res.status(201).json(data)

        } catch (error) {
            next(error)
        }
    }

}

module.exports = TransactionsController;
