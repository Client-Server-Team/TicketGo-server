const {Transaction, Ticket, User} = require("../models");

class TransactionsController {
    static async getTransactionById (req,res,next) {
        try {
            const {id} = req.params
            
            const data = await Transaction.findOne({
                where : {
                    id : +id
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

            if (!data) {
                throw {name : 'NotFound', message : `Transaction with id ${id} not found`}
            }

            res.status(200).json(data)

        } catch (error) {
            next(error)
        }
    }
}

module.exports = TransactionsController;
