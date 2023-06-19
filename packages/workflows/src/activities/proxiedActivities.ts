import { proxyActivities, ActivityOptions } from "@temporalio/workflow";
import { createActivities } from "./createActivities";

// Default options
const defaultOptions: ActivityOptions = {
  startToCloseTimeout: '1 hour',
  heartbeatTimeout: '30 seconds',
  retry: {
    maximumAttempts: 5,
  },
};

export const ProxiedActivities = proxyActivities<ReturnType<typeof createActivities>>(defaultOptions);

export function getCustomProxiedActivities(customOptions?: ActivityOptions) {
  return proxyActivities<ReturnType<typeof createActivities>>({
    ...defaultOptions,
    ...customOptions,
  });
};