import React, { useEffect } from "react";
import { ThemeStore } from "./stores/theme_store";
import { observer } from "mobx-react-lite";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory,
} from "react-router-dom";

import "./App.scss";
import { Homepage } from "./components/Homepage/homepage";
import { VideoStore } from "./stores/video_store";

type Props = {
  themeStore: ThemeStore;
  videoStore: VideoStore;
};
export const App = observer(({ themeStore, videoStore }: Props) => {
  const { theme } = themeStore;
  const history = useHistory();

  useEffect(() => {
    if (videoStore.state) {
      const { state } = videoStore;
      history.push(`/room/${state.roomId}`);
    }
  }, [videoStore.state]);
  return (
    <div
      className="app"
      style={{ backgroundColor: theme.bgColor, color: theme.color }}
    >
      <Router>
        <Switch>
          <Route
            path="/room/:roomId"
            component={() => <span>cool room</span>}
          />
          <Route
            component={() => <Homepage videoStore={videoStore} theme={theme} />}
            path="/"
          />
        </Switch>
      </Router>
    </div>
  );
});
