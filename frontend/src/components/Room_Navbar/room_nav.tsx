import React from "react";
import { observer } from "mobx-react-lite";
import { VideoStore } from "../../stores/video_store";

type Props = {
  videoStore: VideoStore;
};
export const RoomNav = observer(({ videoStore }: Props) => {
  const { state } = videoStore;

  return <div className="room-nav"></div>;
});
