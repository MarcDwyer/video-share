export type VideoLink = [source: string, id: string];

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
