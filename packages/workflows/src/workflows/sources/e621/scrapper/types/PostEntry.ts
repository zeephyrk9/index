export interface PostEntry {
    id: number,

    created_at: string,
    updated_at: string,

    file: {
        url: string,
    },

    tags: {
        general: string[],
        species: string[],
        character: string[],
        copyright: [],
        artist: string[],
        invalid: string[],
        lore: string[],
        meta: string[],
    }
};