import { stat, writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const CACHE = "cache";

const createFileName = (fileName) => {
    let date = new Date();

    return `${fileName}-${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`;
};

const createFilePath = (fileName) => {
    return path.join(CACHE, createFileName(fileName) + ".html");
};

const checkFileExist = (file) => {
    return existsSync(file);
};

const cache = async (response, fileName) => {
    await stat(CACHE)
        .then(async (stats) => {
            if (!stats.isDirectory()) {
                await mkdir(CACHE);
            }
        })
        .catch(async (_) => {
            await mkdir(CACHE);
        });

    await writeFile(createFilePath(fileName), Buffer.from(response));
};

export { cache, checkFileExist, createFilePath };
