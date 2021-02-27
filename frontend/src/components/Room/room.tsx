import React, { useCallback, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { VideoStore } from "../../stores/video_store";
import { useParams } from "react-router-dom";
import { IS_DEV } from "../..";
import { Payload } from "../../type_defs/backend_defs";
import { PayloadTypes, RequestTypes } from "../../type_defs/request_types";

import "./room.scss";

type Props = {
  videoStore: VideoStore;
};
type Params = {
  roomId: string;
};
export const Room = observer(({ videoStore }: Props) => {
  const { roomId } = useParams<Params>();

  const handleMsg = useCallback(
    (msg: MessageEvent<string>) => {
      const data = JSON.parse(msg.data) as Payload;
      console.log(data);

      if ("type" in data) {
        switch (data.type) {
          case PayloadTypes.SetState:
            videoStore.state = data.payload;
        }
      }
    },
    [videoStore]
  );

  useEffect(() => {
    if (!videoStore.ws) {
      const url =
        IS_DEV === "development"
          ? `ws://localhost:1338`
          : `ws://${document.location.hostname}`;
      const ws = new WebSocket(url);
      ws.onmessage = (msg) => handleMsg(msg);
      ws.onopen = () => {
        videoStore.ws = ws;
      };
    } else if (videoStore.ws && !videoStore.state) {
      videoStore.ws.send(
        JSON.stringify({ type: RequestTypes.GetState, roomId })
      );
    }
  }, [videoStore.ws]);

  return <div className="room"></div>;
});
