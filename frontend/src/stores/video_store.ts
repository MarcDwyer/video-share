import { makeAutoObservable } from "mobx";
import { VideoLink } from "../type_defs/backend_defs";

type VideoState = {
  roomId: string;
  source: VideoLink;
};
export class VideoStore {
  state: VideoState | null = null;
  ws: WebSocket | null = null;
  constructor() {
    makeAutoObservable(this);
  }
}
