import axios from "axios";
import { createWriteStream } from "fs";
import * as stream from "stream";
import { promisify } from "util";

const streamFinished = promisify(stream.finished);

export async function downloadLargeFile(
    payload: {
        url: string,
        saveToFile: string,
    }
) {
    const writer = createWriteStream(payload.saveToFile);

    return axios.get(payload.url, { responseType: 'stream' }).then(async (response) => {
        response.data.pipe(writer);
        return await streamFinished(writer);
    })
};