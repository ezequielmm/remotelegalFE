import React, { ReactNode, useContext, useEffect } from "react";
import { Redirect, useLocation } from "react-router-dom";
import TEMP_TOKEN from "../../constants/ApiService";
import { useAuthentication } from "../../hooks/auth";
import useCurrentUser from "../../hooks/useCurrentUser";
import { GlobalStateContext } from "../../state/GlobalState";

interface IAuthenticatorProps {
    children: ReactNode;
    routesWithGuestToken?: string[];
}

const Authenticator = ({ children, routesWithGuestToken }: IAuthenticatorProps) => {
    const { state } = useContext(GlobalStateContext);
    const [getCurrentUser, currentUserPending] = useCurrentUser();
    const { currentUser } = state?.user;
    const token = localStorage.getItem(TEMP_TOKEN);
    const { isAuthenticated } = useAuthentication();
    const { pathname } = useLocation();
    const isPathNameInRoutesWithGuestTokenArray = routesWithGuestToken?.some((route) => pathname.includes(route));

    useEffect(() => {
        if (!currentUser) {
            getCurrentUser();
        }
    }, [currentUser, getCurrentUser]);

    if (isAuthenticated === false) {
        if (token && isPathNameInRoutesWithGuestTokenArray) {
            return <>{children}</>;
        }

        return (
            <Redirect
                to={{
                    pathname: "/",
                    state: pathname,
                }}
            />
        );
    }

    return isAuthenticated === null || currentUserPending ? null : <>{children}</>;
};
export default Authenticator;
