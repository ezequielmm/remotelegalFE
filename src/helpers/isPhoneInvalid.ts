import removeWhitespace from "./removeWhitespace";

const isPhoneInvalid = (value) => {
    const normalizedValue = removeWhitespace(value);
    const textRegex = !/^\(?([2-9][0-8][0-9])\)?[-. ]?([2-9][0-9]{2})[-. ]?([0-9]{4})$/.test(normalizedValue);
    if (value.length) {
        return textRegex;
    }
    return false;
};
export default isPhoneInvalid;
