import { TagEntry } from "@workflows/database/types";

export function CreateTagQuery(payload: TagEntry) {
    return `
        MERGE (tag:Tag {
            ${ CreateTagQueryBody(payload) }
        })
    `;
};

// Used in AssignTagToPost to create
// new tag
export function CreateTagQueryBody(payload: TagEntry) {
    return `
        // Basic properties
        name: "${ payload.name }",
        type: "${ payload.type }"
    `;
};
