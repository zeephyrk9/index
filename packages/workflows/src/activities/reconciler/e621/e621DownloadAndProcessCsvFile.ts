import axios from "axios";
import { PostEntry } from "@workflows/workflows/sources/e621/scrapper/types";
import CsvReadableStream from "csv-reader";
import { promisify } from "util";
import { createUnzip } from "zlib";
import { createReadStream, createWriteStream } from "fs";
import { finished, pipeline } from "stream";

const streamFinished = promisify(finished);
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
    // Downloading csv file
    const fileWriter = createWriteStream("./reconciler-data.zip");

    await axios.get(url, { responseType: 'stream' }).then((response) => {
        response.data.pipe(fileWriter);
        return streamFinished(fileWriter);
    });
    
    // Unzipping this file
    const unzip = createUnzip();
    const archiveReader = createReadStream("./reconciler-data.zip");
    const csvFileWriter = createWriteStream("./reconciler-data.csv", "utf-8");

    await pipelineAsync(
        archiveReader,
        unzip,
        async function* (sourceReader) {

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
        },
        csvFileWriter
    );

    const readFile = promisify<Array<PostEntry>>((callback) => {
        const entries: Array<PostEntry> = [];

        const csvFileReader = createReadStream("./reconciler-data.csv", "utf-8");

        csvFileReader
            // Reading csv data
            .pipe(new CsvReadableStream({ asObject: true, parseNumbers: true, trim: true }))
            .on('data', (row: Record<string, string | number>) => {
                const transformedRow = transformRow(row);
                if (transformedRow) entries.push(transformedRow);
            })
            .on('end', () => {
                callback(null, entries);
            });
    });

    return await readFile();
};