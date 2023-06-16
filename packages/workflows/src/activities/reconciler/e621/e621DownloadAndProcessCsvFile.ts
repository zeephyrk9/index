import axios from "axios";
import { PostEntry } from "@workflows/workflows/sources/e621/scrapper/types";
import CsvReadableStream from "csv-reader";
import { promisify } from "util";
import { createUnzip } from "zlib";
import { createReadStream, createWriteStream } from "fs";
import { pipeline } from "stream";

const pipelineAsync = promisify(pipeline);

function transformHashToUrl(hash: string, ext: string): string {
    // @todo uh?
    const baseUrl = "https://static1.e621.net/data/";

    return baseUrl + hash.slice(0, 2) + "/" + hash.slice(2, 4) + "/" + hash + "." + ext;
};

function transformRow(row: Record<string, string | number>): PostEntry | null {

    if (row.id && row.created_at && row.updated_at) {
        // urgh
        return {
            id: row.id as number,
            created_at: row.created_at as string,
            updated_at: row.updated_at as string,
            file: {
                url: transformHashToUrl(row.md5 as string, row.file_ext as string),
            },
            // @todo add all tags
            tags: {
                artist: [],
                character: [],
                copyright: [],
                general: (row.tag_string as string).split(' '),
                invalid: [],
                lore: [],
                meta: [],
                species: []
            }
        };
    };

    return;
};

export async function e621DownloadAndProcessCsvFile(url: string) {
    // Downloading and unzipping csv file
    const fileWriterStream = createWriteStream("./reconciler-data.csv");
    const unzipStream = createUnzip();

    // Currently I don't have enough mental power to figure out how to
    // properly strip file headers from gzipped stream, so I'm just leave this
    // as it is
    const funnyStream = async function* (sourceReader) {
        // lmfao
        // I'll rot in hell for this, won't I?
        for await (const chunk of sourceReader) {
            const stringified = Buffer.from(chunk).toString()
            if (stringified.includes("id,uploader_id,created_at")) {
                const removeFromData = stringified.slice(0, stringified.indexOf("id,uploader_id"));
                yield Buffer.from(stringified.replace(removeFromData, ""), "utf-8");
                continue;
            };
            
            yield chunk;
        };
    };

    // Downloading and unzipping this file
    await axios.get(url, { responseType: 'stream' })
        .then((response) => {
            return pipelineAsync(
                response.data,
                unzipStream,
                // Slices file header from this stream
                funnyStream,
                fileWriterStream
            )
        });

    // Reading csv file, transforming it's contents and returning
    const readFile = promisify<Array<PostEntry>>((callback) => {
        const entries: Array<PostEntry> = [];
        // let index = 0;

        const csvFileReader = createReadStream("./reconciler-data.csv", "utf-8");

        csvFileReader
            // Reading csv data
            .pipe(new CsvReadableStream({ asObject: true, parseNumbers: true, trim: true }))
            .on('data', (row: Record<string, string | number>) => {
                const transformedRow = transformRow(row);
                if (transformedRow) entries.push(transformedRow);

                // @todo
                // updating e621ReconcilerEntry-<index> in redis storage

                // index++;
            })
            .on('end', () => {
                callback(null, entries);
                // callback(null, { length: index });
            });
    });

    return await readFile();
};