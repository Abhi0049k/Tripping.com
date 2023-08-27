const { Router } = require('express');
const { userAuthorization } = require('../middlewares/user.authorization');
const { userAuthen } = require('../middlewares/user.authentication');
const { bookAuthen } = require('../middlewares/booking.authentication');
const { userBookingAuthentication } = require('../middlewares/user.authenticationtwo');
const { bookingPlace, totalBookings, confirmBooking, deleteBooking, completeBooking } = require('../controllers/bookings.controllers');

const bookingRouter = Router();

bookingRouter.post('/bookPlace', userAuthorization, bookingPlace);

bookingRouter.get('/totalBookings', userAuthorization, totalBookings);

bookingRouter.get('/confirmBooking/:id', userAuthen, confirmBooking);

bookingRouter.delete('/deleteBooking/:id', userBookingAuthentication, deleteBooking);

bookingRouter.post('/completeBooking', bookAuthen, completeBooking);

module.exports = bookingRouter;