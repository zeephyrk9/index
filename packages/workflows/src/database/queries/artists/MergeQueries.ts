import { ArtistEntry } from "@workflows/database/types";

export function CreateArtistForPost(postId: string, artist: ArtistEntry) {
    return `
        MATCH (post:Post { id: "${ postId }" })
        MERGE (artist:Artist { name: "${ artist.name }" })
        MERGE (post)-[rel:HAS_ARTIST]->(artist)
        RETURN post,rel,artist;
    `;
};