const mongoose = require('mongoose');

const TicketChatSchema = new mongoose.Schema({
    ticketId: { 
        type: String, 
        require: true 
    },
    email: { 
        type: String, 
        require: true 
    },
    message: {
        type: String, 
        require: true
    },

 }, {timestamps:true  });

module.exports = mongoose.model('TicketChat', TicketChatSchema)