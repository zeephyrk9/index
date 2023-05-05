import { AbstractSchedule } from "@workflows/schedules";
import { e621ScrapeProcessor } from "@workflows/workflows/scrapers";

export const Scrapers: Array<AbstractSchedule> = [
    {
        id: 'e621-default',
        handler: e621ScrapeProcessor,
        intervals: [{ every: '10s' }]
    }
];