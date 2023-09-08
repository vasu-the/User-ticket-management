const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
   // _id: mongoose.Schema.Types.ObjectId, // Optional: _id field is automatically added by Mongoose
  reason: {
    type: String,
    required: true
  },
  ticketId: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Payment_Issue','Others'],
    default: 'Others',
    required: true
  },
  priority: {
    type: String,
    enum: ['High', 'Low'],
    required: true
  },
  screenShotURL: {
    type: String,
    required: false
  },
  status: {
    type: String,
    enum: ['Opened','Assigned','Resolved'],
    default: 'Opened',
    required: true
  },
  // supportPersonId: {
  //   type: String,
  //   required:true
  // },
  resolved:{
    type:Boolean,
    default:false
  },
  
   assignedTo: {
    type: String
  },
  // escalated: {
  //   type: Boolean,
  //   default: false
  // },
  // subject: {
  //   type: String,
  //   required: true
  // }
}, { timestamps: true });

module.exports = mongoose.model('Ticket', ticketSchema);
