import { Server, Socket } from "socket.io";
import { gameController } from "../controllers/gameController";

let usersConnected = 0;
let master_images = Array(480).fill(null);

//this is where all listeners for the game will be
export function registerGameHandlers(io: Server, socket: Socket) {
  socket.on("player_submitted", (i, last_placed, piece) => {
    if (last_placed != null) {
      master_images[last_placed] = null;
    }
    master_images[i] = piece;
    io.emit("piece_placed2", master_images);
  });

  // will have to add other listeners for other game events.
  //have piece added or player submitted, will need more instead of generic gameupdate

  //receive info from a client
  socket.on("game_update", async (data: any) => {
    //game controller processes move( uses game repository to getgame then save game)
    const payload = await gameController.processMove(data);

    io.to(data.gameId).emit("game_update", payload); //we will use controllers for this?
  });
}
