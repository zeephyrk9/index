import { NativeConnection, Worker } from '@temporalio/worker';
import * as Activities from './activities';

async function run() {
  const worker = await Worker.create({
    workflowsPath: require.resolve('./workflows'),
    activities: Activities,
    taskQueue: process.env.TASK_QUEUE ?? 'dev-task-queue',
    connection: await NativeConnection.connect({
        address: process.env.TEMPORAL_URL ?? 'localhost:7233'
    })
  });

  // Step 2: Start accepting tasks on the `hello-world` queue
  await worker.run();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});