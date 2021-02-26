import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { URLHandler } from "./url_parser.ts";
import { Hub } from "./hub.ts";

import {
  WebSocket,
  WebSocketServer,
} from "https://deno.land/x/websocket@v0.0.6/mod.ts";

const app = new Application();
const router = new Router();

const decoder = new TextDecoder();

const hub = new Hub();

type URLBody = {
  url: string;
};
router.post("/video/create", async (ctx) => {
  const bodyR = ctx.request.body({ type: "reader" });
  const bytes = await Deno.readAll(bodyR.value);
  const result = decoder.decode(bytes);
  const { url } = JSON.parse(result) as URLBody;
  const links = new URLHandler(url).handleMsg();

  if (!links) {
    ctx.response.body = "No source could be found";
    return;
  } else {
    const room = hub.createRoom(links);
    ctx.response.body = room.state;
  }
});

const wss = new WebSocketServer(1338);

wss.on("connection", (ws: WebSocket) => {
  ws.on("message", function (msg: string) {
    console.log(msg);
    ws.send(msg);
  });
});

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 1337 });
