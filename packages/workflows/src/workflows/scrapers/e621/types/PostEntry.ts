export interface PostEntry {
    id: number,

    created_at: string,
    updated_at: string,

    file: {
        url: string,
    }
};