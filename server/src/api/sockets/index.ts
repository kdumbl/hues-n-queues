import { Server, Socket } from "socket.io";

import { registerGameHandlers } from "./gameHandlers";
import { registerLobbyHandlers } from "./lobbyHandlers";

import { authSocket } from "../middleware/socketAuthMiddleware";

export const setupSockets = (io: Server) => {
  //check to make sure JWT is had
  authSocket(io);

  io.sockets.on("connection", (socket: Socket) => {
    console.log("User connected:", socket.data.user);
    
    // Register lobby/chat handlers if applicable
    registerLobbyHandlers(io, socket);
    // Register the refactored game handlers
    registerGameHandlers(io, socket);

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};
