import fs from "fs";
import path from "path";

const CACHE = "cache";

const createFileName = (fileName) => {
    let date = new Date();

    return `${fileName}-${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`;
};

const createFilePath = (fileName) => {
    return path.join(CACHE, createFileName(fileName) + ".html");
};

const checkFileExist = async (file) => {
    return fs.promises.access(file, fs.constants.R_OK);
};

const clearCacheFile = async (partFileName) => {
    const fileNames = await fs.promises.readdir(CACHE);

    const promises = fileNames
        .filter((fileName) => {
            return fileName.includes(partFileName);
        })
        .map((filename) => {
            return fs.promises.rm(path.join(CACHE, filename));
        });

    Promise.all(promises);
};

const cache = async (response, fileName) => {
    await fs.promises
        .stat(CACHE)
        .then(async (stats) => {
            if (!stats.isDirectory()) {
                await fs.promises.mkdir(CACHE);
            }
        })
        .catch(async (_) => {
            await fs.promises.mkdir(CACHE);
        });

    await clearCacheFile(fileName);
    await fs.promises.writeFile(
        createFilePath(fileName),
        Buffer.from(response)
    );
};

export { cache, checkFileExist, createFilePath };
