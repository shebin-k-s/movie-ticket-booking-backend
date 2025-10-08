import express from 'express';
import { BookingController } from '../controllers/booking.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorizeRole } from '../middlewares/authorize.middleware';
import { UserRole } from '../entities/user.entity';

const bookingRouter = express.Router();

bookingRouter.route('/my')
    .get(authenticate, BookingController.getMyBookings);

bookingRouter.route('/user/:userId')
    .get(authenticate, authorizeRole(UserRole.ADMIN), BookingController.getUserBookings);

bookingRouter.route('/:bookingId')
    .get(authenticate, BookingController.getBookingById)

export default bookingRouter;
