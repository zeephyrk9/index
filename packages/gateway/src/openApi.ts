import { generateOpenApiDocument } from "trpc-openapi";
import { GlobalAppRouter } from "./routers";

export const openApiDocument = generateOpenApiDocument(GlobalAppRouter, {
    title: 'tRPC OpenAPI',
    version: '1.0.0',
    baseUrl: 'http://localhost:3000/api',
});