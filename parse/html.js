import { load } from "cheerio";

const parse = async (html) => {
    const $ = load(html);
    const points = $("h3[id]");

    return points.map(function () {
        return $(this).text();
    });
};

export { parse };
