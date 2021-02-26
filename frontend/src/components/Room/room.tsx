import React, { useCallback, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { VideoStore } from "../../stores/video_store";
import { useParams } from "react-router-dom";
import { IS_DEV } from "../..";

import { RequestTypes } from "../../type_defs/request_types";

type Props = {
  videoStore: VideoStore;
};
type Params = {
  roomId: string;
};
export const Room = observer(({ videoStore }: Props) => {
  const { roomId } = useParams<Params>();

  const handleMsg = (msg: MessageEvent<any>) => {
    const data = JSON.parse(msg.data);
    console.log(data);
  };

  useEffect(() => {
    if (!videoStore.ws) {
      const url =
        IS_DEV === "development"
          ? `ws://localhost:1338`
          : `ws://${document.location.hostname}`;
      const ws = new WebSocket(url);
      ws.onmessage = (msg) => handleMsg(msg);
      ws.onopen = () => {
        console.log("open");
        videoStore.ws = ws;
      };
    } else if (videoStore.ws && !videoStore.state) {
      videoStore.ws.send(
        JSON.stringify({ type: RequestTypes.GetState, roomId })
      );
    }
  }, [videoStore.ws]);

  return <span>{roomId}</span>;
});
