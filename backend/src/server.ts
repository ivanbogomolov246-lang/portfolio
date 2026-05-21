import { app } from "./app.js";
import { env } from "./utils/env.js";

app.listen(env.port, () => {
  console.log(`Backend started on http://localhost:${env.port}`);
});
