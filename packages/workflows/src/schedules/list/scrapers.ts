import { e621ScrapeProcessor } from "@workflows/workflows";

export default [
    {
        id: 'e621-default',
        handler: e621ScrapeProcessor,
        args: [{ limit: 10 }],
        intervals: [{ every: '20s' }],
    }
];