export type VideoLink = [source: string, id: string];

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
