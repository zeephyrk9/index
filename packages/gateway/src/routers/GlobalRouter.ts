import { Router } from "../router";
import { UserRoute } from "./User";

export const GlobalAppRouter = Router({
    user: UserRoute,
});

export type AppRouter = typeof GlobalAppRouter;