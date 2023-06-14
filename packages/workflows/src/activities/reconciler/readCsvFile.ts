import CsvReadableStream from "csv-reader";
import { createReadStream } from "fs";

export async function readCsvFile(payload: { inputFile: string }) {
    const inputFile = createReadStream(payload.inputFile);

    return inputFile
        .pipe(new CsvReadableStream());
};