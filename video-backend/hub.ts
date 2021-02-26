import { VideoRoom } from "./video_room.ts";
import { VideoLink } from "./url_parser.ts";
import { v4 } from "https://deno.land/std@0.88.0/uuid/mod.ts";

export type VideoRooms = Map<string, VideoRoom>;

export class Hub {
  rooms: VideoRooms = new Map();

  createRoom(source: VideoLink) {
    const room = new VideoRoom(v4.generate(), source);
    this.rooms.set(v4.generate(), room);
    return room;
  }
}
