import "socket.io";
import { tokenPayload } from "./types";

declare module "socket.io" {
  interface Socket {
    user?: tokenPayload;
  }
}
