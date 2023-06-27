import express from 'express';
import { createExpressMiddleware } from 'temporal-rest';
import * as workflows from '@workflows'
import { getClient } from './client';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;
const pathPrefix = process.env.PATH_PREFIX ?? "";

async function run() {
  const app = express();

  app.use(createExpressMiddleware(workflows, await getClient(), process.env.TASK_QUEUE ?? "dev-task-queue"))

  await app.listen(port, host, () => {
    console.log(`[ ready ] http://${host}:${port}`);
    console.log(`| with path prefix: ${pathPrefix}`);
  });
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
