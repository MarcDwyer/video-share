import React from "react";
import { observer } from "mobx-react-lite";
import { VideoStore } from "../../stores/video_store";
import "./room_nav.scss";
import { ThemeStore } from "../../stores/theme_store";

type Props = {
  videoStore: VideoStore;
  themeStore: ThemeStore;
};
export const RoomNav = observer(({ videoStore, themeStore }: Props) => {
  const { state } = videoStore;
  const theme = themeStore.theme;
  if (state) {
    console.log(state.connInfo.length);
  }
  return (
    <div
      className="room-nav"
      style={{
        backgroundColor: theme.cardColor,
      }}
    >
      {state && (
        <div className="conns">
          <span className="conn-headline">Connected Users</span>
          {state.connInfo.map((conn, i) => {
            let username = conn.username;
            const t = typeof username;
            if (t === "number") {
              username = `user${username}`;
            }
            return (
              <span className="conn" key={i}>
                {username}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
});
