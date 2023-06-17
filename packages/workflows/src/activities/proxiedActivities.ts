import { proxyActivities } from "@temporalio/workflow";
import { createActivities } from "./createActivities";

export const ProxiedActivities = proxyActivities<ReturnType<typeof createActivities>>({
    startToCloseTimeout: '1 hour',
    heartbeatTimeout: '30 seconds',
    retry: {
      maximumAttempts: 5
    }
});