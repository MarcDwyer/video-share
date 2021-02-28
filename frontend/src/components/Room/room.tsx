import React, { useCallback, useEffect, useRef } from "react";
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

  const roomRef = useRef<string>(roomId);

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
    if (roomRef.current !== roomId) {
      console.log("changing rooms...");
      const payload = {
        to: roomId,
        from: roomRef,
      };
      videoStore.ws.send(
        JSON.stringify({ type: RequestTypes.ChangeRoom, payload })
      );
      roomRef.current = roomId;
    }
  }, [roomId]);

  useEffect(() => {
    return function () {
      if (videoStore.state && videoStore.ws) {
        videoStore.ws.send(
          JSON.stringify({
            type: RequestTypes.RemoveRoom,
            from: videoStore.state.roomId,
          })
        );
        videoStore.reset();
      }
    };
  }, []);
  useEffect(() => {
    if (videoStore.ws) {
      videoStore.reset();
    }
    const url =
      IS_DEV === "development"
        ? `ws://localhost:1338`
        : `ws://${document.location.hostname}`;
    const ws = new WebSocket(url);
    ws.onmessage = (msg) => handleMsg(msg);
    ws.onopen = () => {
      videoStore.ws = ws;
      ws.send(JSON.stringify({ type: RequestTypes.GetState, roomId }));
    };
  }, []);

  return <div className="room"></div>;
});
