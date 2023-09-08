const router = require('express').Router();
const ticketsRoutes = require('../controllers/ticketController')
//ticket management
router.post('/tickets', ticketsRoutes.newTickets); //use user ID
router.get('/get-ticket/:ticketId', ticketsRoutes.getTickets); //use user ID
//router.put('/update-tickets/:ticketId', ticketsRoutes.updateTickets);   //use ticket id for updating tickets
router.post('/resolve-ticket',ticketsRoutes.resolveTicket);
router.post('/tickets-assign/:ticketId', ticketsRoutes.assignTicket);

router.get('/tickets-search', ticketsRoutes.searchTickets);

router.delete('/delete-tickets/:ticketId', ticketsRoutes.deleteTickets); //use user ID
router.delete('/delete-alltickets',ticketsRoutes.deleteAllTickets);
router.get('/all-tickets', ticketsRoutes.getAllTickets);
router.post('/ticket-chat',ticketsRoutes.ticketChat);
router.get('/get-chat/:ticketId',ticketsRoutes.ChatById)

module.exports = router;