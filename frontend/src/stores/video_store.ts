import { makeAutoObservable } from "mobx";
import { State } from "../type_defs/backend_defs";

export class VideoStore {
  state: State | null = null;
  ws: WebSocket | null = null;

  error: string | null = null;
  start = 60;
  constructor() {
    makeAutoObservable(this);
  }

  reset() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  changeStart(start: number) {
    this.state.start = start;
  }
}
