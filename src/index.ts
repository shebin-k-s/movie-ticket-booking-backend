import app from "./app";
import { AppDataSource } from "./config/data-source";
import dotenv from "dotenv";
import { Server as SocketIOServer } from 'socket.io';
import http from 'http';
import registerSocketHandlers from "./socket/socket";


dotenv.config()

const server = http.createServer(app);

export const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});


const PORT = process.env.PORT || 3000;


AppDataSource.initialize()
  .then(async () => {
    server.listen(PORT, () => {
      console.log(`Ticket booking server running at ${PORT}`);
    })

    registerSocketHandlers(io);


  })
  .catch((err) => {
    console.log(`Ticket Booking DB Connection error: ${err}`);

  })