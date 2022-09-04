const getPointName = (str) => {
    if (str.includes("=")) {
        const [xNumber, name] = str.split("=");

        return [toNumber(xNumber), name];
    } else {
        // X42 has wrong format
        const xNumber = str.substring(0, 6);
        const name = str.substring(7);

        return [toNumber(xNumber), name];
    }
};

const toNumber = (xNumber) => {
    return xNumber.slice(2, -2);
};

export { getPointName };
