import express from 'express';
import { HallController } from '../controllers/hall.controller';
import { validateBody } from '../middlewares/body.validator';
import { hallCreateSchema } from '../validations/hall.validations';
import { authenticate } from '../middlewares/auth.middleware';
import { authorizeRole } from '../middlewares/authorize.middleware';
import { UserRole } from '../entities/user.entity';

const hallRouter = express.Router();

hallRouter.route('/')
    .get(HallController.getAllHalls)
    .post(authenticate, authorizeRole(UserRole.ADMIN, UserRole.THEATER_ADMIN), validateBody(hallCreateSchema), HallController.createHall);


hallRouter.route('/:hallId')
    .get(HallController.getHallById)
    .delete(authenticate, authorizeRole(UserRole.ADMIN, UserRole.THEATER_ADMIN), HallController.deleteHall);


hallRouter.route('/theater/:theaterId')
    .get(HallController.getHallsByTheater);

export default hallRouter;
