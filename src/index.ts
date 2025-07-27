import { Hono } from "hono";
import usersRoute from "./routes/users";
import vehiclesRoute from "./routes/vehicles";
import { allRoutesInApp } from "./utils";

const app = new Hono();

app.route("/users", usersRoute);
app.route("/vehicles", vehiclesRoute);

app.get("/", (c) => {
    return c.json({
        message: "Welcome to the API",
        version: "1.0.0",
        routes: {
            users: allRoutesInApp(usersRoute),
            vehicles: allRoutesInApp(vehiclesRoute),
        },
    });
});

app.notFound((c) => {
    return c.json({ message: "Route not found" }, 404);
});

app.onError((err, c) => {
    console.error("Error occurred:", err);
    return c.json({ message: "Internal Server Error" }, 500);
});

export default app;
