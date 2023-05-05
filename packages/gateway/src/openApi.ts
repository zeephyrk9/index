import { generateOpenApiDocument } from "trpc-openapi";
import { GlobalAppRouter } from "./routers";

export const openApiDocument = generateOpenApiDocument(GlobalAppRouter, {
    title: 'zeephyr index docs',
    version: '1.0.0',
    baseUrl: process.env.ENVIRONMENT == "production" ? "https://api.odzi.dog/zeephyr/v1/" : "http://localhost:3000/",
});