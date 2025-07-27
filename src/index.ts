import { Hono } from "hono";
import usersRoute from "./routes/users";
import vehiclesRoute from "./routes/vehicles";

const app = new Hono();

app.get("/", (c) => {
    return c.text("Hello Hono!");
});

app.route("/users", usersRoute);
app.route("/vehicles", vehiclesRoute);

export default app;
