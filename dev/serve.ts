import { serve } from "@hono/node-server";

import app from "../src/index";

const port = process.env.PORT || 3000;

const server = serve(
    {
        fetch: app.fetch,
        port: Number(port),
    },
    () => {
        console.log(`Server is running on http://localhost:${port}`);
    }
);

process.on("SIGINT", () => {
    server.close();
    process.exit(0);
});
process.on("SIGTERM", () => {
    server.close((err) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        process.exit(0);
    });
});
