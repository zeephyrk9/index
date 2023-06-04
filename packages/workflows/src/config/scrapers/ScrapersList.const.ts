import { AbstractSchedule } from "@workflows/schedules";
import { e621ScrapeProcessor } from "@workflows/workflows/scrapers";

export const Scrapers: Array<AbstractSchedule> = [
    {
        id: 'e621-default',
        handler: e621ScrapeProcessor,
        args: [{ limit: 10 }],
        intervals: [{ every: '10s' }]
    }
];