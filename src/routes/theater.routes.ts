import express from 'express'
import { TheaterController } from '../controllers/theater.controller';
import { validateBody } from '../middlewares/body.validator';
import { createTheaterSchema } from '../validations/theater.validations';
import { authenticate } from '../middlewares/auth.middleware';
import { authorizeRole } from '../middlewares/authorize.middleware';
import { UserRole } from '../entities/user.entity';

const theaterRouter = express.Router()


theaterRouter.route("/")
    .post(authenticate, authorizeRole(UserRole.ADMIN), validateBody(createTheaterSchema), TheaterController.createTheater)
    .get(TheaterController.getAllTheaters)

theaterRouter.route("/:theaterId")
    .get(TheaterController.getTheaterById)
    .put(authenticate, authorizeRole(UserRole.ADMIN, UserRole.THEATER_ADMIN), TheaterController.updateTheater)
    .delete(authenticate, authorizeRole(UserRole.ADMIN, UserRole.THEATER_ADMIN), TheaterController.deleteTheater);


export default theaterRouter