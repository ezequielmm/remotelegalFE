import { useState, useEffect } from "react";
import { Auth } from "aws-amplify";

const useAuthentication = () => {
    const [isAuthenticated, setUserIsAuthenticated] = useState(null);
    useEffect(() => {
        const checkAuthentication = async () => {
            try {
                await Auth.currentAuthenticatedUser();
                await Auth.currentSession();
                return setUserIsAuthenticated(true);
            } catch {
                return setUserIsAuthenticated(false);
            }
        };
        checkAuthentication();
    }, []);
    return { isAuthenticated };
};
export default useAuthentication;
