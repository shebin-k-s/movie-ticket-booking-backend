import { DataSource } from "typeorm";
import dotenv from 'dotenv'
import { User } from "../entities/user.entity";
import { Theater } from "../entities/theater.entity";
import { Screen } from "../entities/screen.entity";
import { Movie } from "../entities/movie.entity";
import { Seat } from "../entities/seat.entity";
import { Show } from "../entities/show.entity";
import { Booking } from "../entities/booking.entity";

dotenv.config();

export const AppDataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    // host: process.env.DB_HOST,
    // port: parseInt(process.env.DB_PORT),
    // username: process.env.DB_USER,
    // password: process.env.DB_PASSWORD,
    // database: process.env.DB_NAME,
    synchronize: true,
    logging: false,
    ssl: {
        rejectUnauthorized: false,
    },
    entities: [
        User,
        Theater,
        Screen,
        Movie,
        Show,
        Seat,
        Booking
    ]

})