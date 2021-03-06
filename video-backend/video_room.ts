import { PayloadTypes } from "./type_defs/request_types.ts";
import { WebSocket } from "https://deno.land/x/websocket@v0.0.6/mod.ts";
import { Hub } from "./hub.ts";

import { getRandomItem } from "./util.ts";

export interface MyWebSocket extends WebSocket {
  roomId?: string;
}
export type Conns = Map<WebSocket, ConnInfo>;

export type ConnInfo = {
  username?: string | number;
  status: "viewer" | "mod";
};

export type State = {
  source: string;
  roomId: string;
  connInfo: ConnInfo[];
  start: number;
};
export type Payload = {
  type: string;
  payload: any;
};
export type Config = {
  id: string;
  source: string;
};
export class VideoRoom {
  conns: Conns = new Map();
  hasMod: boolean = false;

  id: string;
  source: string;
  start: number = 0;

  constructor({ id, source }: Config, private hub: Hub) {
    this.id = id;
    this.source = source;
  }

  get state(): Payload {
    const state: State = {
      source: this.source,
      roomId: this.id,
      connInfo: this.connUsers,
      start: this.start,
    };
    return {
      type: PayloadTypes.SetState,
      payload: state,
    };
  }
  get connUsers() {
    const users: ConnInfo[] = [];
    let index = 0;
    for (const { status, username } of this.conns.values()) {
      const user = username ? username : index;
      users.push({ username: user, status });
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
  /**
   * Randomly select a new mod
   * Only one mod per room, they control the state
   */
  selectedNewMod() {
    if (!this.conns.size) {
      console.log("No users connected");
      return;
    }
    const conn = getRandomItem(this.conns);
    conn.status = "mod";
  }
  /**
   * Delete Connection but also check to see if a mod
   * If mod than establish another mod connected to the room
   */
  removeConn(ws: MyWebSocket) {
    const conn = this.conns.get(ws);
    if (conn) {
      this.conns.delete(ws);
      if (conn.status === "mod") {
        this.selectedNewMod();
      }
    }
    if (!this.conns.size) {
      this._terminate();
    } else {
      this.broadcast(this.state);
    }
  }
  addConn(ws: MyWebSocket) {
    ws.roomId = this.id;
    let status: "viewer" | "mod" = "viewer";
    if (!this.hasMod) {
      status = "mod";
      this.hasMod = true;
    }
    const connInfo: ConnInfo = { status };
    this.conns.set(ws, connInfo);
    this.broadcast(this.state);
    this.sendInfo(ws, connInfo);
  }
  sendInfo(ws: WebSocket, info?: ConnInfo) {
    const connInfo = info || this.conns.get(ws);
    if (connInfo) {
      const payload: Payload = {
        type: PayloadTypes.ConnInfo,
        payload: connInfo,
      };
      ws.send(JSON.stringify(payload));
    }
  }
  updateUsername(ws: MyWebSocket, username: string) {
    const conn = this.conns.get(ws);
    if (conn) {
      conn.username = username;
      this.broadcast(this.state);
    } else {
      console.error(`No conn found`);
    }
  }
  _terminate() {
    for (const ws of this.conns.keys()) {
      ws.close(1000, "Game has been terminated");
    }
    this.conns = new Map();
    this.hub.rooms.delete(this.id);
  }
}
