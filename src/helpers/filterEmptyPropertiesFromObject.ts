const filterEmptyPropertiesFromObject = (obj, matcher) =>
    Object.fromEntries(Object.entries(obj).filter(([, value]) => value !== matcher));
export default filterEmptyPropertiesFromObject;
