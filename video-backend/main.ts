import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { URLHandler } from "./url_parser.ts";
import { Hub } from "./hub.ts";
import { RequestTypes } from "./type_defs/request_types.ts";
import { WebSocketServer } from "https://deno.land/x/websocket@v0.0.6/mod.ts";
import { MyWebSocket } from "./video_room.ts";
import { VideoRoom } from "./video_room.ts";

const app = new Application();
const router = new Router();

const decoder = new TextDecoder();

const hub = new Hub();

type URLBody = {
  url: string;
};
router.post("/video/create", async (ctx: any) => {
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
    console.log(`Created: ${room.id}`);
    ctx.response.body = { roomId: room.id };
  }
});

const wss = new WebSocketServer(1338);

wss.on("connection", (ws: MyWebSocket) => {
  ws.on("message", function (msg: string) {
    const req = JSON.parse(msg);
    let room: VideoRoom | undefined;
    if ("type" in req) {
      switch (req.type) {
        case RequestTypes.GetState:
          room = hub.rooms.get(req.roomId);
          if (room) {
            room.addConn(ws);
          }
          break;
        case RequestTypes.ChangeRoom:
          const { to, from } = req.payload as { to: string; from: string };
          const fromRoom = hub.rooms.get(from),
            toRoom = hub.rooms.get(to);
          if (fromRoom) {
            fromRoom.removeConn(ws);
          }
          if (toRoom) {
            toRoom.addConn(ws);
          }
        case RequestTypes.RemoveRoom:
          if (!ws.roomId) return;
          room = hub.rooms.get(ws.roomId || req.payload.from);
          if (room) {
            console.log("removed conn");
            room.removeConn(ws);
          }
      }
    }
  });
  ws.on("close", (_: number) => {
    if (!ws.roomId) return;
    const room = hub.rooms.get(ws.roomId);
    if (room) {
      room.removeConn(ws);
    }
  });
});

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 1337 });
