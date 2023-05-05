import axios, { AxiosRequestConfig } from "axios";

export function getAPIRequestContents<TResponseStructure>(
    options: AxiosRequestConfig
): Promise<TResponseStructure> {
    // Adding User-Agent to headers
    if (!options.headers) options.headers = {};
    options.headers["User-Agent"] = "Zeephyr Index/1.0 (by julipup on github)";

    return axios.request({
        ...options,
    }).then((response) => response.data as TResponseStructure);
};