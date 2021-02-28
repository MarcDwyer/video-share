import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { ThemeStruct } from "../../stores/theme_store";
import * as yup from "yup";
import { useHistory } from "react-router-dom";

import { VideoStore } from "../../stores/video_store";

import "./homepage.scss";
import { RequestTypes } from "../../type_defs/request_types";

type Props = {
  theme: ThemeStruct;
  videoStore: VideoStore;
};

const schema = yup.object().shape({
  url: yup.string().required().url(),
});

export const Homepage = observer(({ theme, videoStore }: Props) => {
  const history = useHistory();
  return (
    <div className="homepage">
      <div
        style={{
          backgroundColor: theme.cardColor,
        }}
        className="create"
      >
        <Formik
          initialValues={{ url: "" }}
          validationSchema={schema}
          onSubmit={async (values) => {
            try {
              const f = await fetch("/video/create", {
                method: "POST",
                body: JSON.stringify({
                  url: values.url,
                }),
              });
              const { roomId } = await f.json();
              history.push(`/room/${roomId}`);
            } catch (e) {
              console.error(e);
            }
          }}
        >
          <Form>
            <div className="fields">
              <ErrorMessage className="error-msg" name="url" component="span" />
              <Field
                autoComplete="off"
                style={{ border: `1px solid ${theme.borderColor}` }}
                name="url"
                type="text"
                placeholder="Enter your video's url"
              />
            </div>
            <div className="buttons">
              <button type="submit">Create</button>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
});
