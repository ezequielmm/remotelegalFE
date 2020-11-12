import React from "react";
import { Redirect } from "react-router-dom";
import { useAuthentication } from "../../hooks/auth";

const Authenticator = ({ children }) => {
    const { isAuthenticated } = useAuthentication();
    if (isAuthenticated === false) {
        const { pathname } = window.location;
        return (
            <Redirect
                to={{
                    pathname: "/",
                    state: pathname,
                }}
            />
        );
    }

    return isAuthenticated === null ? null : children;
};
export default Authenticator;
