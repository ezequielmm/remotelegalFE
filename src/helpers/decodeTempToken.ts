import TEMP_TOKEN from "../constants/ApiService";

const decodeTempToken = () => {
    const tempToken = localStorage.getItem(TEMP_TOKEN);
    if (!tempToken) {
        return null;
    }
    let decodedToken;
    try {
        decodedToken = tempToken && JSON.parse(atob(tempToken.split(".")[1]));
    } catch (error) {
        decodedToken = null;
    }
    return decodedToken;
};
export default decodeTempToken;
