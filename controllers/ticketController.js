const Ticket = require('../models/ticketModel');
const TicketChat = require('../models/ticketChatModel');

const nodemailer = require('nodemailer');



const newTickets = async (req, res) => {
    const { reason, category, email, screenShotURL } = req.body
    let priority = 'Low';
    if (category === 'Payment_Issue') {
        priority = 'High'
    }
    // Generate ticket ID
    const ticketCount = await Ticket.countDocuments();
    const ticketId = (ticketCount + 1).toString().padStart(5, '0');
    // Create new ticket
    const ticket = new Ticket({
        ticketId,
        reason,
        email,
        category,
        screenShotURL,
        priority
    });
    try {
        await ticket.save();
        const transporter = nodemailer.createTransport({
            host: 'smtp-relay.sendinblue.com',
            port: 587,
            auth: {
                user: process.env.USER_NAME,
                pass: process.env.PASS_WORD
            }
        });
        const mailOption = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Ticket Raised',
            html: `<p> Your ticket has been raised successfully.</p>

             <a href= "please click the button to contact with our support team" <button> view ticket </button></a>

            <p>thankyou Team </p>`
        };

        let info = await transporter.sendMail(mailOption);
        console.log(`Message Sent:${info.messageId}`);

        return res.status(200).json({ ticket, msg: 'Ticket raised Successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
    }
};

const assignTicket = async (req, res) => {
    try {
      const { ticketId } = req.params;
      const { assignedTo } = req.body;
  
      // Find the ticket
      const ticket = await Ticket.findOne({ ticketId });
  
      if (!ticket) {
        return res.status(404).json({ message: 'Ticket not found' });
      }
  
      ticket.assignedTo = assignedTo;
      ticket.status = 'Assigned';
      ticket.msg = 'Assigned to SubAdmin';
  
      // Save the updated ticket
      const assignedTicket = await ticket.save();
  
      return res.status(200).json({ data: assignedTicket, message: 'Ticket assigned successfully' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }
  };
  
  
  const getTickets = async (req, res) => {
    const ticketId = req.params.ticketId;
    try {
        const tickets = await Ticket.findOne({ ticketId });
        return res.status(200).json({ tickets, msg: 'Success' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
    }
};

const getAllTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find();
        return res.status(200).json({ tickets, msg: 'Success' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
    }
};
const resolveTicket = async (req, res) => {
  try { 
      const { email } = req.body;
    
  const ticket = await Ticket.find(
    { email: email },
    { status: 'Resolved', resolved: true },
    { new: true }
  );
      if (!ticket) {
          return res.status(404).json({ message: 'Ticket not found' });
      }
      // Sending the transactional email
      const transporter = nodemailer.createTransport({
          host: 'smtp-relay.sendinblue.com',
          port: 587,
          auth: {
              user: process.env.USER_NAME,
              pass: process.env.PASS_WORD
          }
      });
      const mailOptions = {
          from: process.env.EMAIL,
          to: email,
          subject: 'Your Ticket Resolved',
          text: `<p> Thank you for raising Ticket , Your ticket has been resolved successfully. If you have any Queries Contact US..</p>`,
      };
      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              console.error('Error sending email:', error);
          } else {
              console.log('Email sent:', info.response);
          }
      });
      res.status(200).json({ message: 'Ticket resolved successfully' });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server Error' });
  }
};
  

 
const ticketChat = async (req, res) => {
    try {
        const { ticketId, email, message } = req.body;

        // Save the message to the database
        const chat = new TicketChat({ ticketId, email, message });
        await chat.save();

        return res.status(200).json({ message: 'Tickets has been on Progress ' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'err' });
    }
};
const ChatById = async (req, res) => {
    try {
      const ticketId = req.params.ticketId;
  
      const chat = await TicketChat.find({ ticketId });
  
      return res.status(200).json({ chat, message: 'Success' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
  };
  const deleteTickets = async (req, res) => {
    const ticketId = req.params.ticketId;
    try {
        await Ticket.deleteOne({ user: ticketId });
        return res.status(200).json({ message: 'Tickets deleted successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
    }
}


  const deleteAllTickets = async (req, res) => {
    const ticketId = req.params.ticketId;
    try {
      await Ticket.deleteMany({ ticketId });
  
      return res.status(200).json({ message: 'All Tickets are deleted successfully' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }
  };

  const searchTickets = async (req, res) => {
    try {
      const { searchQuery } = req.query;
  
      // Search for tickets based on the searchQuery
      const tickets = await Ticket.find({ $text: { $search: searchQuery } });
  
      return res.status(200).json({ tickets, message: 'Search results' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }
  };



  
module.exports = {searchTickets, newTickets, getTickets, deleteTickets,assignTicket, getAllTickets, ticketChat,ChatById,deleteAllTickets,resolveTicket }

  
 