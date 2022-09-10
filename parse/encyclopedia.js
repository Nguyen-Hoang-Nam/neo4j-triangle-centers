import { relations, mapRelation } from "./relation.js";

const getPointName = (str) => {
    if (str.includes("=")) {
        const [xNumber, name] = str.split("=");

        return [toNumber(xNumber.trim()), name.trim()];
    } else {
        const leftPart = str.split(")")[0] + ")";
        const xNumber = leftPart;
        const name = str.substring(leftPart.length).trim();

        return [toNumber(xNumber), name];
    }
};

const getProperties = (paragraph) => {
    const lines = paragraph.trim().split("\n");

    const result = [];

    const length = lines.length;
    for (let i = 0; i < length; i++) {
        let line = lines[i];
        if (line[line.length - 1] == ":") {
            i++;
            line += lines[i];
        }

        if (!line.includes("=")) {
            continue;
        }

        if (line[0] != "X") {
            continue;
        }

        const obj = binaryRelation(line);
        if (obj) {
            result.push(obj);
        }
    }

    return result;
};

const toNumber = (xNumber) => {
    return parseInt(xNumber.slice(2, -1));
};

const binaryRelation = (line) => {
    const [xNumber, name] = line.split("=");

    const node1 = toNumber(xNumber.trim());
    const rightPart = name.trim();

    let result = null;
    const length = relations.length;
    for (let i = 0; i < length; i++) {
        const relation = relations[i];
        const regex = new RegExp(`^${relation}`);
        if (rightPart.match(regex)) {
            const node2 = toNumber(rightPart.substring(relation.length).trim());
            const relative = mapRelation[relation];

            result = {
                node1,
                relative,
                node2,
            };

            break;
        }
    }

    return result;
};

export { getPointName, getProperties };
