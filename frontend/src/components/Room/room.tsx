import React, { useCallback, useEffect, useRef } from "react";
import { observer } from "mobx-react-lite";
import { VideoStore } from "../../stores/video_store";
import { Link, useParams } from "react-router-dom";
import { IS_DEV } from "../..";
import { Payload } from "../../type_defs/backend_defs";
import { PayloadTypes, RequestTypes } from "../../type_defs/request_types";

import { RoomNav } from "../Room_Navbar/room_nav";
import { ThemeStore } from "../../stores/theme_store";

import { VideoPlayer } from "../VideoPlayer/videoplayer";
import "./room.scss";

type Props = {
  videoStore: VideoStore;
  themeStore: ThemeStore;
};
type Params = {
  roomId: string;
};
export const Room = observer(({ videoStore, themeStore }: Props) => {
  const { roomId } = useParams<Params>();
  const { theme } = themeStore;
  const roomRef = useRef<string>(roomId);

  const handleMsg = useCallback(
    (msg: MessageEvent<string>) => {
      const data = JSON.parse(msg.data) as Payload;
      if ("type" in data) {
        switch (data.type) {
          case PayloadTypes.SetState:
            videoStore.state = data.payload;
            if (videoStore.error) videoStore.error = null;
            break;
          case PayloadTypes.Error:
            videoStore.error = data.payload.msg || "Server error";
            break;
          case PayloadTypes.ConnInfo:
            videoStore.connInfo = data.payload;
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

  return (
    <div className="room">
      {videoStore.error && (
        <div className="error">
          <span>{videoStore.error}.</span>
          <Link
            style={{ backgroundColor: theme.blueBtn }}
            className="homepage-btn"
            to="/"
          >
            Homepage
          </Link>
        </div>
      )}
      {videoStore.state && !videoStore.error && (
        <>
          <RoomNav themeStore={themeStore} videoStore={videoStore} />
          <VideoPlayer state={videoStore.state} />
        </>
      )}
    </div>
  );
});
