import { VideoRoom } from "./video_room.ts";
import { VideoLink } from "./url_parser.ts";
import { v4 } from "https://deno.land/std@0.88.0/uuid/mod.ts";

export type VideoRooms = Map<string, VideoRoom>;

export class Hub {
  rooms: VideoRooms = new Map();

  createRoom(source: VideoLink) {
    const id = v4.generate();
    const room = new VideoRoom({ id, source }, this);
    this.rooms.set(id, room);
    return room;
  }
}
