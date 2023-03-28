import { Workflow } from "@temporalio/workflow";

export default interface AbstractWorkflowMeta {
    path: `/${string}`;
    handler: Workflow;
    
    generateWorkflowId?: () => string;

    input: any;
    output: any,
};