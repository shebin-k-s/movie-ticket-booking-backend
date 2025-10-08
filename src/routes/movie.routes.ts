import express from "express";
import { MovieController } from "../controllers/movie.controller";
import { validateBody } from "../middlewares/body.validator";
import { createMovieSchema } from "../validations/movie.validations";
import { authenticate } from "../middlewares/auth.middleware";
import { authorizeRole } from "../middlewares/authorize.middleware";
import { UserRole } from "../entities/user.entity";

const movieRouter = express.Router();

movieRouter.route("/")
    .get(MovieController.getAllMovies)
    .post(authenticate, authorizeRole(UserRole.ADMIN, UserRole.THEATER_ADMIN), validateBody(createMovieSchema), MovieController.createMovie)

movieRouter.route("/:movieId")
    .get(MovieController.getMovieById)
    .put(authenticate, authorizeRole(UserRole.ADMIN, UserRole.THEATER_ADMIN), validateBody(createMovieSchema), MovieController.updateMovie)
    .delete(authenticate, authorizeRole(UserRole.ADMIN), MovieController.deleteMovie);


export default movieRouter;
