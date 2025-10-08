import { Server, Socket } from 'socket.io';


export default function registerSocketHandlers(io: Server) {
    io.on('connection', (socket: Socket) => {


        socket.on("joinShowRoom", (showId: string) => {
            const roomName = `show-${showId}`;
            socket.join(roomName);

        })

        socket.on("leaveShowRoom", (showId: string) => {
            const roomName = `show-${showId}`;
            socket.leave(roomName);
        });

        socket.on('disconnect', async () => {
            console.log(`Socket ${socket.id} disconnected`);
        });
    });
}
