import { Server, Socket } from "socket.io";
import { registerGameHandlers } from "./gameHandlers";
import { registerLobbyHandlers } from "./lobbyHandlers";
import { setupSocket } from "../middleware/socketAuthMiddleware";
import { GameState, Player } from "../types.ts";

function initSockets(io: Server) {
  //also will allow us to connect a user to a socket connection
  //io.use(socketAuthMiddleware); Authentication stuff later

  io.on("connection", (socket: Socket) => {
    console.log(`User Connected: ${socket.id}`);

    //check where connection is from and set up base state
    setupSocket(io, socket);

    registerGameHandlers(io, socket);
    registerLobbyHandlers(io, socket);

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
}

export { initSockets };
