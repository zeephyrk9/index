import { NativeConnection, Worker } from '@temporalio/worker';
import { ContextInstance } from './context';
import { createActivities } from './activities/createActivities';
import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin'
import { resolve } from "path";

async function run() {
  // Creating new context instance
  const context = ContextInstance;

  const worker = await Worker.create({
    workflowsPath: require.resolve('./workflows'),
    bundlerOptions: {
      webpackConfigHook(config) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        config.resolve.plugins = [new TsconfigPathsPlugin({
          configFile: resolve(__dirname, "..", "tsconfig.json"),
          baseUrl: '.'
        })];
        
        return config;
      }
    },
    activities: createActivities(context),
    taskQueue: process.env.TASK_QUEUE ?? 'dev-task-queue',
    connection: await NativeConnection.connect({
        address: process.env.TEMPORAL_URL ?? 'localhost:7233'
    }),
    debugMode: true,
  });

  await worker.run();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});