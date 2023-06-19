import { Context } from "@workflows/context";
import { ArtistEntry, CreateArtistForPost } from "../../database";
import { runSessionableRequest } from "@workflows/utilities/runSessionableRequest";

export async function createArtistForPost(context: Context, postId: string, artist: ArtistEntry) {
    return await runSessionableRequest<ArtistEntry>(context, CreateArtistForPost(postId, artist));
};