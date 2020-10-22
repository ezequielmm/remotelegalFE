const isInvalidEmail = (email) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
export default isInvalidEmail;
