import React from "react";
import { observer } from "mobx-react-lite";
import { VideoStore } from "../../stores/video_store";

type Props = {
  videoStore: VideoStore;
};
export const Room = observer(({ videoStore }: Props) => {
  return <span>hello</span>;
});