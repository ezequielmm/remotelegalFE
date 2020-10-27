const isPasswordInvalid = (password) => {
    return !/^((?=.*\d)(?=.*[A-Z]).{8,})$/.test(password);
};
export default isPasswordInvalid;
