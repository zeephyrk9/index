import { Context } from "@workflows/context";
import { getAPIRequestContents } from "./scrapers";
import { AxiosRequestConfig } from "axios";
import { createPost, getPostById, search } from "./posts";
import { ContentEntry } from "@workflows/database";

export function createActivities(context: Context) {
    return {
        getAPIRequestContents<T>(options: AxiosRequestConfig) {
            return getAPIRequestContents<T>(options);
        },

        getPostById(id: string) {
            return getPostById(context, id);
        },

        createPost(payload: ContentEntry) {
            return createPost(context, payload);
        },

        search(query: string) {
            return search(context, query);
        },
    };
};