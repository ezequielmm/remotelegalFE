import removeWhitespace from "./removeWhitespace";

const isPhoneInvalid = (value) => {
    const normalizedValue = removeWhitespace(value);
    return !/^\(?([2-9][0-8][0-9])\)?[-. ]?([2-9][0-9]{2})[-. ]?([0-9]{4})$/.test(normalizedValue);
};
export default isPhoneInvalid;
