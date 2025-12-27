import { Elysia} from "elysia";
import { autoroutes } from "elysia-autoroutes";
import { z } from "zod";

import { cors } from "@elysiajs/cors";
import swagger from "@elysiajs/swagger";


const port = 8080;
const app = new Elysia()
  .use(
    swagger({
      documentation: {
        info: {
          title: "llm-corp engine",
          description: "llm-corp engine API",
          version: "1.0.0",
        },
      },
    }),
  )
  .onBeforeHandle(() => {
    console.log(`Server is running on http://localhost:${port}`);
  })
  .use(cors())
  .use(
    autoroutes({
      routesDir: "./routes",
    }),
  )
  .get("/", () => ({ status: "ok", running: true }), {
    response: z.object({
      status: z.string().describe("Returns ok for health check"),
      running: z.boolean().describe("Returns true if the server is running"),
    }),
    detail: {
      description: "The root endpoint",
      tags: ["App"],
    },
  })
  .listen(port);

export { app };
export type App = typeof app;