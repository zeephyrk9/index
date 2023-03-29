import { IntervalSpec, Workflow } from "@temporalio/client";

export interface AbstractSchedule {
    id: string;
    intervals: IntervalSpec[],
    args?: any[],
    handler: Workflow,
};