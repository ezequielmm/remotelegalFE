import React, { ReactNode } from "react";
import { Redirect, useLocation } from "react-router-dom";
import TEMP_TOKEN from "../../constants/ApiService";
import { useAuthentication } from "../../hooks/auth";

interface IAuthenticatorProps {
    children: ReactNode;
    routesWithGuestToken?: string[];
}

const Authenticator = ({ children, routesWithGuestToken }: IAuthenticatorProps) => {
    const token = localStorage.getItem(TEMP_TOKEN);
    const { isAuthenticated } = useAuthentication();
    const { pathname } = useLocation();
    const isPathNameInRoutesWithGuestTokenArray = routesWithGuestToken?.some((route) => pathname.includes(route));

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

    return isAuthenticated === null ? null : <>{children}</>;
};
export default Authenticator;
