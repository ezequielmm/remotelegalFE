const isPasswordInvalid = (password) => {
    return !/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])\S{8,}$/.test(password);
};
export default isPasswordInvalid;
