import { load } from "cheerio";

const preprocessing = ($) => {
    $(".preamble-sect").remove();
    $(".triheader").map(function () {
        $(this).replaceWith($(`<hr class="gray">`));
    });
};

const parse = async (html, number) => {
    const $ = load(html);

    preprocessing($);

    const hrs = $("hr.gray");
    const pointProperties = hrs.map(function () {
        return $(this).prev("p").text();
    });

    if (number == 1) {
        pointProperties.splice(0, 9);
    }

    const h3s = $("h3[id]");
    const pointNames = h3s.map(function () {
        return $(this).text();
    });

    const length = pointProperties.length;
    const points = [];
    for (let i = 0; i < length; i++) {
        points.push({
            name: pointNames[i],
            property: pointProperties[i],
        });
    }

    return points;
};

export { parse };
