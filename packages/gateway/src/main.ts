import express from 'express';
import * as trpc from '@trpc/server/adapters/express';
import { GlobalAppRouter } from './routers';
import { createOpenApiExpressMiddleware } from 'trpc-openapi';
import swagger from 'swagger-ui-express';
import { openApiDocument } from './openApi';
import { createContext } from './context';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();

app.use(
  '/trpc',
  trpc.createExpressMiddleware({
    router: GlobalAppRouter,
    createContext,
  })
);
app.use('/api', createOpenApiExpressMiddleware({ router: GlobalAppRouter, createContext }));
app.use('/docs', swagger.serve, swagger.setup(openApiDocument));

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
