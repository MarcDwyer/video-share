import { VideoLink } from "./url_parser.ts";
import { PayloadTypes } from "./type_defs/request_types.ts";
import { WebSocket } from "https://deno.land/x/websocket@v0.0.6/mod.ts";

export interface MyWebSocket extends WebSocket {
  roomId?: string;
}
export type Conns = Map<WebSocket, ConnInfo>;
export type ConnInfo = {
  username?: string | number;
};
export type State = {
  source: VideoLink;
  roomId: string;
  connInfo: ConnInfo[];
};
export type Payload = {
  type: string;
  payload: any;
};
export class VideoRoom {
  conns: Conns = new Map();
  constructor(public id: string, public source: VideoLink) {}

  get state(): State {
    return {
      source: this.source,
      roomId: this.id,
      connInfo: this.connUsers,
    };
  }
  get connUsers() {
    const users: ConnInfo[] = [];
    let index = 0;
    for (const connInfo of this.conns.values()) {
      const username = connInfo.username ? connInfo.username : index;
      users.push({ username });
      ++index;
    }
    return users;
  }
  broadcast(payload: Payload) {
    const data = JSON.stringify(payload);
    for (const ws of this.conns.keys()) {
      ws.send(data);
    }
  }
  removeConn(ws: MyWebSocket) {
    ws.roomId = undefined;
    this.conns.delete(ws);
  }
  addConn(ws: MyWebSocket) {
    ws.roomId = this.id;
    this.conns.set(ws, {});
  }
  updateUsername(ws: MyWebSocket, username: string) {
    const conn = this.conns.get(ws);
    if (conn) {
      conn.username = username;
      this.broadcast({ type: PayloadTypes.SetState, payload: this.state });
    } else {
      console.error(`No conn found`);
    }
  }
}
