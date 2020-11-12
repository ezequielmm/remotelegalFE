import { useState, useEffect, useRef } from "react";
import { Auth } from "aws-amplify";
import { useLocation, useHistory } from "react-router-dom";
import * as ERRORS from "../constants/login";
import buildRequestOptions from "../helpers/buildRequestOptions";
import useFetch from "./useFetch";

export const useAuthentication = () => {
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

export const useSignIn = (location, emailValue, passwordValue) => {
    const params = location?.state;
    const history = useHistory();
    const [submitError, setSubmitError] = useState("");
    const [loading, setLoading] = useState(false);

    const onSubmit = async () => {
        if (submitError) {
            setSubmitError("");
        }
        setLoading(true);
        try {
            await Auth.signIn(emailValue.trim(), passwordValue);
            return history.push(params || "/dashboard");
        } catch (e) {
            setLoading(false);
            return setSubmitError(ERRORS.AWS_ERRORS[e.message] || ERRORS.NETWORK_ERROR);
        }
    };
    return { onSubmit, loading, submitError };
};

export const useVerifyToken = () => {
    const { isAuthenticated } = useAuthentication();
    const queryParams = window.location.search;
    const verificationHash = new URLSearchParams(queryParams).get("verificationHash");
    const requestObj = buildRequestOptions("POST", {
        verificationHash,
    });
    const { error, data, fetchAPI } = useFetch(
        `${process.env.REACT_APP_BASE_BE_URL}/api/Users/verifyUser`,
        requestObj,
        false
    );
    const fetchAPIRef = useRef(fetchAPI);
    useEffect(() => {
        const handleVerifyToken = async () => {
            if (verificationHash && isAuthenticated) {
                await Auth.signOut();
                return fetchAPIRef.current();
            }
            if (verificationHash && isAuthenticated === false) {
                fetchAPIRef.current();
            }
            return null;
        };
        handleVerifyToken();
    }, [verificationHash, isAuthenticated]);
    return { isAuthenticated, verificationHash, error, data };
};

export const useSignUp = (requestBody) => {
    const requestObj = buildRequestOptions("POST", requestBody);
    const { error, data, loading, fetchAPI } = useFetch(
        `${process.env.REACT_APP_BASE_BE_URL}/api/Users`,
        requestObj,
        false
    );
    return { error, data, loading, fetchAPI };
};

export const useVerifyEmail = (email) => {
    const requestObj = buildRequestOptions("POST", {
        emailAddress: email,
    });
    const { error, loading, fetchAPI } = useFetch(
        `${process.env.REACT_APP_BASE_BE_URL}/api/Users/resendVerificationEmail`,
        requestObj,
        false
    );
    return { error, loading, fetchAPI };
};
