import { ArtistEntry } from "@workflows/database/types";

export function CreateArtistQuery(payload: ArtistEntry) {
    return `
        MERGE (artist:Artist) {
            ${ CreateArtistQueryBody(payload) }
        }
    `;
};

export function CreateArtistQueryBody(payload: ArtistEntry) {
    return `
        // Basic properties
        name: "${ payload.name }"
    `;
};