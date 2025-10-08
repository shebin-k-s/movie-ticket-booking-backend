import express from "express";
import { ShowController } from "../controllers/show.controller";
import { validateBody } from "../middlewares/body.validator";
import { createShowSchema } from "../validations/show.validations";
import { authenticate } from "../middlewares/auth.middleware";
import { authorizeRole } from "../middlewares/authorize.middleware";
import { UserRole } from "../entities/user.entity";

const showRouter = express.Router();

showRouter.route("/")
    .get(ShowController.getAllShows)
    .post(authenticate, authorizeRole(UserRole.ADMIN, UserRole.THEATER_ADMIN), validateBody(createShowSchema), ShowController.createShow)

showRouter.route("/movies/:movieId")
    .get(ShowController.getShowsByMovie)


showRouter.route("/:showId")
    .get(ShowController.getShowById)
    .delete(authenticate, authorizeRole(UserRole.ADMIN, UserRole.THEATER_ADMIN), ShowController.deleteShow);

export default showRouter;
