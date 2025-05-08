if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const cors = require("cors");
const router = require("./routers");
const app = express();

// Socket.io
const { createServer } = require("http");
const { Server } = require("socket.io");
const axios = require('axios')

app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use("/", router);

// Socket.io
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*"
  }
});
io.on("connection", async (socket) => {

  const access_token = socket.handshake.auth.access_token
  const ticketId = socket.handshake.auth.ticketId

  socket.on(`trigger/buy-${ticketId}`, async (arg, callback) => {
    try {
      if(access_token) {
        const response = await axios({
          method: 'post',
          url: 'https://p2-gp.mfaishaldp.my.id/myticket/' + arg.ticketId,
          data: {
              totalPrice : +arg.totalPrice,
              totalQuantity : +arg.totalQuantity
          },
          headers : {
            Authorization : 'Bearer ' + socket.handshake.auth.access_token
          }
        }) //! axios buy
  
        const resTicketById = await axios({
          method: 'get',
          url: 'https://p2-gp.mfaishaldp.my.id/tickets/' + arg.ticketId,
          headers : {
            Authorization : 'Bearer ' + access_token
          }
        }) //! axios get quantity
    
        io.emit(`res/newQty-${ticketId}`,{
          newQty : resTicketById.data.quantity
        })
      }
    } catch (error) {
      callback({message : error.response.data.message})
    }
    
  });


  socket.on(`trigger/newQty-${ticketId}`,async (arg) => {

    if (access_token) {
      const resTicketById = await axios({
        method: 'get',
        url: 'https://p2-gp.mfaishaldp.my.id/tickets/' + arg.ticketId,
        headers : {
          Authorization : 'Bearer ' + access_token
        }
      }) //! axios get quantity
  
      io.emit(`res/newQty-${ticketId}`,{
        newQty : resTicketById.data.quantity
      })
    }

  })


});

module.exports = httpServer;
