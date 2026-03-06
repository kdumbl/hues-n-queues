import { Server, Socket } from "socket.io";
import { gameController } from "../controllers/gameController";
//this is where all the emit and on functionality for the live game will live
export function registerGameHandlers(io: Server, socket: Socket) {
  //basic what is happening

  //recieve info from a client
  socket.on("game_update", async (data: any) => {
    //game controller processes move( uses game repository to getgame then save game)
    const payload = await gameController.processMove(data);

    io.to(data.gameId).emit("game_update", payload); //we will use controllers for this?
  });
}
