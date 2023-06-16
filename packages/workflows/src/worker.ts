import { NativeConnection, Worker } from '@temporalio/worker';
import { ContextInstance } from './context';
import { createActivities } from './activities/createActivities';
import { resolve } from "path";

async function run() {
  // Creating new context instance
  const context = ContextInstance;

  const worker = await Worker.create({
    workflowsPath: require.resolve('./workflows'),
    bundlerOptions: {
      webpackConfigHook(config) {
        config.resolve.alias = {
          ...config.resolve?.alias,
          "@workflows": resolve(__dirname),
        };

        return config;
      }
    },
    activities: createActivities(context),
    taskQueue: process.env.TASK_QUEUE ?? 'dev-task-queue',
    connection: await NativeConnection.connect({
        address: process.env.TEMPORAL_URL ?? 'localhost:7233'
    }),
    // experimental
    reuseV8Context: true,
    showStackTraceSources: true,
  });

  await worker.run();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});