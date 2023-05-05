import { Context } from "../../context";

export async function search(context: Context, query?: string) {
    return "search query:" + query;
};