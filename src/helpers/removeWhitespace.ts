const removeWhiteSpace = (value) => {
    return value
        .split("")
        .filter((entry) => entry.trim())
        .join("");
};
export default removeWhiteSpace;
