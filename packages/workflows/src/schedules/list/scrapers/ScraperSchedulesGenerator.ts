import { Scrapers } from "@workflows/config/scrapers";
import { AbstractSchedule } from "@workflows/schedules/AbstractSchedule";

export default function GenerateSchedules(): Array<AbstractSchedule> {
    // Getting scrapers information
    return Scrapers;
};