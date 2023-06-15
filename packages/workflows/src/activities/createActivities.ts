import { Context } from "@workflows/context";
import { getAPIRequestContents } from "./scrapers";
import { AxiosRequestConfig } from "axios";
import { createTagForPost, createPost, createTag, getPostById, getTagByName, search } from "./posts";
import { ArtistEntry, ContentEntry, TagEntry, VendorType } from "@workflows/database";
import { createArtistForPost } from "./artists";
import { e621DownloadAndProcessCsvFile } from "./reconciler";

export function createActivities(context: Context) {
    return {
        // Basic
        getAPIRequestContents<T>(options: AxiosRequestConfig) {
            return getAPIRequestContents<T>(options);
        },

        // Content-related
        getPostById(vendor: VendorType, id: string) {
            return getPostById(context, vendor, id);
        },

        createPost(payload: ContentEntry) {
            return createPost(context, payload);
        },

        search(query: string) {
            return search(context, query);
        },


        // > Tags
        createTag(payload: TagEntry) {
            return createTag(context, payload);
        },

        getTagById(name: string) {
            return getTagByName(context, name);
        },

        createTagForPost(postId: string, tag: TagEntry) {
            return createTagForPost(context, postId, tag);
        },

        // > Artists
        createArtistForPost(postId: string, artist: ArtistEntry) {
            return createArtistForPost(context, postId, artist);
        },
        
        e621DownloadAndProcessCsvFile(url: string) {
            return e621DownloadAndProcessCsvFile(url);
        },
    };
};