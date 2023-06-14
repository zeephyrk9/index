import { PostEntry } from "@workflows/workflows/scrapers/e621/types";
import CsvReadableStream from "csv-reader";
import { createReadStream } from "fs";
import { promisify } from "util";

function transformHashToUrl(hash: string, ext: string): string {
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

export async function e621ProcessCsvFile(payload: { inputFile: string }) {
    const inputFile = createReadStream(payload.inputFile, "utf-8");

    const readFile = promisify<Array<PostEntry>>((callback) => {
        const entries: Array<PostEntry> = [];
        
        return inputFile
            .pipe(new CsvReadableStream({ asObject: true, parseNumbers: true, trim: true }))
            .on('data', (row: Record<string, string | number>) => {
                const transformedRow = transformRow(row);
                if (transformedRow) entries.push(transformedRow);
            })
            .on('end', () => {
                callback(null, entries);
            });
    })

    return await readFile();
};