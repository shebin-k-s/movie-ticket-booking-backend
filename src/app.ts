import express from 'express'
import { errorHandler } from './middlewares/errorHandler'
import authRouter from './routes/auth.routes'
import theaterRouter from './routes/theater.routes'
import hallRouter from './routes/hall.routes'
import showRouter from './routes/show.routes'
import movieRouter from './routes/movie.routes'
import seatRouter from './routes/seat.routes'
import bookingRouter from './routes/booking.routes'
import cors from "cors";
import paymentRouter from './routes/payment.routes'

const app = express()


app.use(express.json())

app.use(express.urlencoded({ extended: true }))

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))

app.use("/api/v1/auth", authRouter)
app.use("/api/v1/theaters", theaterRouter)
app.use("/api/v1/halls", hallRouter)
app.use("/api/v1/shows", showRouter)
app.use("/api/v1/movies", movieRouter)
app.use("/api/v1/seats", seatRouter)
app.use("/api/v1/bookings", bookingRouter)
app.use("/api/v1/payments", paymentRouter)

app.use(errorHandler)


export default app