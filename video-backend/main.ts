import { Application, Router } from "https://deno.land/x/oak/mod.ts";

const app = new Application();
const router = new Router();

const decoder = new TextDecoder();

router.post("/video", async (ctx) => {
  const bodyR = ctx.request.body({ type: "reader" });
  const bytes = await Deno.readAll(bodyR.value);
  const result = decoder.decode(bytes);

  ctx.response.body = { gamer: true };
});
// app.use((ctx) => {
//   ctx.response.body = "Hello World!";
// });
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 1337 });
