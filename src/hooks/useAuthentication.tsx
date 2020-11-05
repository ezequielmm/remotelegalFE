import { useState, useEffect } from "react";
import { Auth } from "aws-amplify";
import { useLocation } from "react-router-dom";

const useAuthentication = () => {
    const [isAuthenticated, setUserIsAuthenticated] = useState(null);
    const location = useLocation();
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
    }, [location]);
    return { isAuthenticated };
};
export default useAuthentication;
