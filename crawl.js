import axios from "axios";
import { cache, checkFileExist, createFilePath } from "./cache.js";
import { parse } from "./parse/html.js";
import { readFile } from "fs/promises";
import * as dotenv from "dotenv";
dotenv.config();

const ORIGIN = "https://faculty.evansville.edu/ck6/encyclopedia";

let NUMBER_OF_PAGE = 36;
if (process.env.ENVIRONMENT == "test") {
    NUMBER_OF_PAGE = 1;
}

const firstPage = "etc";
const otherPage = (page) => {
    return `ETCPart${page}`;
};

const fetchData = async (page) => {
    const url = `${ORIGIN}/${page}.html`;

    let data = "";

    try {
        const filePath = createFilePath(page);
        await checkFileExist(filePath);

        data = await readFile(filePath, { Encoding: "Utf8" });
    } catch {
        let response = await axios(url).catch((err) => console.log(err));

        if (response.status !== 200) {
            console.log("Error occurred while fetching data");
            return;
        }

        await cache(response.data, page);

        data = response.data;
    }

    let obj = await parse(data);
    return obj;
};

const parseHtml = async () => {
    const promises = [];
    for (let i = 1; i <= NUMBER_OF_PAGE; i++) {
        let page = "";
        if (i == 1) {
            page = firstPage;
        } else {
            page = otherPage(i);
        }

        promises.push(fetchData(page));
    }

    return Promise.all(promises);
};

export { parseHtml };
