import express from 'express';
import { ScreenController } from '../controllers/screen.controller';
import { validateBody } from '../middlewares/body.validator';
import { screenCreateSchema } from '../validations/screen.validations';
import { authenticate } from '../middlewares/auth.middleware';
import { authorizeRole } from '../middlewares/authorize.middleware';
import { UserRole } from '../entities/user.entity';
import { ShowController } from '../controllers/show.controller';

const screenRouter = express.Router();

screenRouter.route('/')
    .get(ScreenController.getAllScreens)
    .post(authenticate, authorizeRole(UserRole.ADMIN, UserRole.THEATER_ADMIN), validateBody(screenCreateSchema), ScreenController.createScreen);

screenRouter.route('/my')
    .get(authenticate, authorizeRole(UserRole.ADMIN, UserRole.THEATER_ADMIN), ScreenController.getMyScreens)

screenRouter.route('/theater/:theaterId')
    .get(ScreenController.getScreensByTheater);

screenRouter.route('/:screenId/shows')
    .get(ShowController.getShowsByScreen);

screenRouter.route('/:screenId')
    .get(ScreenController.getScreenById)
    .delete(authenticate, authorizeRole(UserRole.ADMIN, UserRole.THEATER_ADMIN), ScreenController.deleteScreen);




export default screenRouter;
