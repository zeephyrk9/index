import { proxyActivities } from "@temporalio/workflow";
import * as Activities from '.';

export const ProxiedActivities = proxyActivities<typeof Activities>({
    startToCloseTimeout: '1 minute',
    retry: {
      maximumAttempts: 5
    }
});