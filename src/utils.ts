import type { Hono } from "hono";

export function allRoutesInApp(app: Hono) {
    return app.routes.map((route) => ({
        method: route.method,
        path: route.path,
    }));
}
