import React from "react";
import { ThemeStore } from "./stores/theme_store";
import { observer } from "mobx-react-lite";
import { Switch, Route } from "react-router-dom";
import { Homepage } from "./components/Homepage/homepage";
import { VideoStore } from "./stores/video_store";
import { Room } from "./components/Room/room";

import "./App.scss";

type Props = {
  themeStore: ThemeStore;
  videoStore: VideoStore;
};
export const App = observer(({ themeStore, videoStore }: Props) => {
  const { theme } = themeStore;

  return (
    <div
      className="app"
      style={{ backgroundColor: theme.bgColor, color: theme.color }}
    >
      <Switch>
        <Route
          path="/room/:roomId"
          render={(p) => <Room {...p} videoStore={videoStore} />}
        />
        <Route
          component={() => <Homepage videoStore={videoStore} theme={theme} />}
          path="/"
        />
      </Switch>
    </div>
  );
});
