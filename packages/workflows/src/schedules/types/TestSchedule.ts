import { searchByTags } from "../../workflows";
import { AbstractSchedule } from "../AbstractSchedule";

export const TestSchedule: AbstractSchedule = {
    id: "test-schedule2",
    intervals: [{ every: '1s' }],
    handler: searchByTags,
    args: [{ query: "test" }]
};