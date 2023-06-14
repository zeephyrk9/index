import { createReadStream, createWriteStream } from 'fs';
import { pipeline } from 'stream';
import { promisify } from 'util';
import { createUnzip } from 'zlib';

const pipelineAsync = promisify(pipeline);

export async function unzipFile(
    payload: {
        sourcePath: string,
        destinationPath: string
    }
) {
    const unzip = createUnzip();
    const sourceReader = createReadStream(payload.sourcePath);
    const destinationWriter = createWriteStream(payload.destinationPath);

    return await pipelineAsync(
        sourceReader, 
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
        destinationWriter
    );
};