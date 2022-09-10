const getPointName = (str) => {
    if (str.includes("=")) {
        const [xNumber, name] = str.split("=");

        return [toNumber(xNumber.trim()), name.trim()];
    } else {
        const leftPart = str.split(")")[0] + ")";
        const xNumber = leftPart;
        const name = str.substring(leftPart.length).trim();

        console.log(xNumber);

        return [toNumber(xNumber), name];
    }
};

const toNumber = (xNumber) => {
    return xNumber.slice(2, -1);
};

export { getPointName };
