import { observer } from "mobx-react-lite";
import React, { useEffect, useMemo, useState } from "react";
import { State } from "../../type_defs/backend_defs";
import YouTube from "react-youtube";

import "./videoplayer.scss";

type Props = {
  state: State;
};
export const VideoPlayer = observer(({ state }: Props) => {
  const opts = useMemo(
    () => ({
      height: "390",
      width: "640",
      playerVars: {
        // https://developers.google.com/youtube/player_parameters
        autoplay: 1,
        start: state.start,
      },
    }),
    [state.start]
  );
  useEffect(() => {
    setTimeout(() => {
      state.start = 1;
    }, 10000);
  }, []);
  console.log(state.start);
  return (
    <div className="video-player">
      <YouTube
        //@ts-ignore
        opts={opts}
        videoId={state.source}
        cueVideo
      />
    </div>
  );
});
