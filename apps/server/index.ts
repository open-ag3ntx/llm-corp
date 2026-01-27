import { Elysia} from "elysia";
import { autoroutes } from "elysia-autoroutes";
import { z } from "zod";

import { cors } from "@elysiajs/cors";
import swagger from "@elysiajs/swagger";


const port = 8080;
const app = new Elysia()
  .onBeforeHandle(() => {
    console.log(`Server is running on http://localhost:${port}`);
  })
  .use(
    autoroutes({
      routesDir: "./routes",
    }),
  )
  .listen(port);

export { app };
export type App = typeof app;