import { Context } from "@workflows/context";
import { ArtistEntry, CreateArtistForPost } from "../../database";

export async function createArtistForPost(context: Context, postId: string, artist: ArtistEntry) {
    return await context.database.run(CreateArtistForPost(postId, artist));
};