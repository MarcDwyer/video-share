import { Application, Router } from "https://deno.land/x/oak/mod.ts";

const app = new Application();
const router = new Router();

router.post("/video", (ctx) => {
  const { body } = ctx.request;
  console.log(body);
  ctx.response.body = JSON.stringify(body);
});
app.use((ctx) => {
  ctx.response.body = "Hello World!";
});

await app.listen({ port: 1337 });
