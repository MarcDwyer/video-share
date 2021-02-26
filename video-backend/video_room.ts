import { VideoLink } from "./url_parser.ts";

export type Conns = Map<WebSocket, boolean>;

export class VideoRoom {
  conns: Conns = new Map();
  constructor(public id: string, public source: VideoLink) {}

  get state() {
    return {
      source: this.source,
      id: this.id,
    };
  }
  broadcast(payload: any) {
    if (typeof payload !== "string") payload = JSON.stringify(payload);
    for (const ws of this.conns.keys()) {
      ws.send(payload);
    }
  }
  removeConn(ws: WebSocket) {
    this.conns.delete(ws);
  }
  addConn(ws: WebSocket) {
    this.conns.set(ws, true);
  }
}
