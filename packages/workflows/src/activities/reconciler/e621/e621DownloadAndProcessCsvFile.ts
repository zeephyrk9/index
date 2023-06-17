import axios from "axios";
import CsvReadableStream from "csv-reader";
import { promisify } from "util";
import { createUnzip } from "zlib";
import { pipeline, Transform } from "stream";
import { Context } from "@workflows/context";
import { ReconcilerPostEntry } from "@workflows/types";

const pipelineAsync = promisify(pipeline);

function transformHashToUrl(hash: string, ext: string): string {
    // @todo uh?
    const baseUrl = "https://static1.e621.net/data/";

    return baseUrl + hash.slice(0, 2) + "/" + hash.slice(2, 4) + "/" + hash + "." + ext;
};

function transformRow(row: Record<string, string | number>): ReconcilerPostEntry | null {
    if (row.id && row.created_at && row.updated_at) {
        return {
            id: row.id as number,
            created_at: row.created_at as string,
            updated_at: row.updated_at as string,
            imageUrl: transformHashToUrl(row.md5 as string, row.file_ext as string),
            tags: (row.tag_string as string).split(' '),
        };
    };

    return;
};

export async function e621DownloadAndProcessCsvFile(context: Context, url: string) {
    // Preparing all our streams
    const unzipStream = createUnzip();
    unzipStream.setEncoding("utf-8");

    // Currently I don't have enough mental power to figure out how to
    // properly strip file headers from gzipped stream, so I'm just leave this
    // as it is
    const funnyTransform = new Transform({
        encoding: "utf-8",
        transform(chunk, encoding, callback) {
            let stringified = Buffer.from(chunk).toString("utf-8")
            if (stringified.includes("id,uploader_id,created_at")) {
                const removeFromData = stringified.slice(0, stringified.indexOf("id,uploader_id"));
                stringified = stringified.replace(removeFromData, "");
            };

            this.push(stringified);
            callback();
        }
    });

    const csvReaderStream = new CsvReadableStream({ asObject: true, parseNumbers: true, trim: true, multiline: true });

    // Downloading and unzipping this file
    const process = promisify<{ length: number }>(async (callback) => {
        await axios.get(url, { responseType: 'stream' })
            .then((response) => {
                let index = -1;
                const writePromises = [];

                return pipelineAsync(
                    response.data,
                    unzipStream,
                    funnyTransform,
                    csvReaderStream
                        .on('data', (data: Record<string, string | number>) => {
                            const transformedRow = transformRow(data);

                            if (transformedRow) {
                                index++;

                                // Adding this row to our temporary redis cache
                                writePromises.push(context.redis.set(`e621ReconcilerEntry:${index}`, JSON.stringify(transformedRow)));
                            };
                        })
                        .on('end', async () => {
                            if (writePromises.length > 0) {
                                // Waiting for all promises to resolve
                                await Promise.all(writePromises);
                            };

                            callback(null, { length: index });
                        }),
                )
            });
    });

    return await process();
};