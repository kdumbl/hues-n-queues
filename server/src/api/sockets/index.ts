import { Server, Socket } from "socket.io";
//import { socketAuthMiddleware } from "../middleware/socketAuthMiddleware";
import { registerGameHandlers } from "./gameHandlers";
import { registerLobbyHandlers } from "./lobbyHandlers";

function initSockets(io: Server) {
  //also will allow us to connect a user to a socket connection
  //io.use(socketAuthMiddleware); Authentication stuff later

  io.on("connection", (socket: Socket) => {
    console.log(`User Connected: ${socket.id}`);

    registerGameHandlers(io, socket);
    registerLobbyHandlers(io, socket);

    socket.on("disconnect", () => {
      console.log(`User disconneced: ${socket.id}`);
    });
  });
}

export { initSockets };
