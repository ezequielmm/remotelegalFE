const isInvalidEmail = (email) => {
    return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};
export default isInvalidEmail;
