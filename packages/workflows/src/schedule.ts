import { WorkflowClient } from './client';
import { AbstractSchedule } from './schedules';
import Schedules from './schedules/list';

async function run() {
    // Getting schedules information
    const client = await WorkflowClient.getClient();
    const schedules: Array<AbstractSchedule> = Object.values(Schedules);

    for (const schedule of schedules) {
        console.log(`[scheduler] Working with schedule: ${ schedule.id } < ${ JSON.stringify(schedule) } >`)
        try {
            // Updating this schedule
            const handle = client.schedule.getHandle(schedule.id);
            console.log("| Schedule exists, updating...");

            await handle.update((previousSchedule) => {
                console.log(`| Previous configuration: ${ JSON.stringify(previousSchedule) }`);

                return {
                    ...previousSchedule,
                    action: {
                        ...previousSchedule.action,
                        args: schedule.args
                    },
                    spec: {
                        ...previousSchedule.spec,
                        intervals: schedule.intervals
                    }
                };
            });
        } catch {
            console.log("| This schedule does not exists, creating it now...");

            // Creating this schedule
            await client.schedule.create({
                scheduleId: schedule.id,
                action: {
                    type: "startWorkflow",
                    workflowType: schedule.handler,
                    taskQueue: process.env.TASK_QUEUE ?? "dev-task-queue",
                    args: schedule.args,
                },
                spec: {
                    intervals: schedule.intervals,
                }
            });
        };

        console.log("--------------------------");
    };
};

run()
.then(() => {
    console.log("[scheduler] Schedules creted/updated successfully");
    process.exit(0);
})
.catch((err) => {
    console.error(err);
    process.exit(1);
});