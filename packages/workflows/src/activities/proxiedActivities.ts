import { proxyActivities } from "@temporalio/workflow";
import { createActivities } from "./createActivities";

export const ProxiedActivities = proxyActivities<ReturnType<typeof createActivities>>({
    startToCloseTimeout: '1 minute',
    retry: {
      maximumAttempts: 5
    }
});