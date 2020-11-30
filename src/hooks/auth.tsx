/* eslint-disable @typescript-eslint/no-unused-vars */
import { Auth } from "aws-amplify";
import { useContext, useEffect, useRef, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import * as ERRORS from "../constants/login";
import { GlobalStateContext } from "../state/GlobalState";
import useAsyncCallback from "./useAsyncCallback";

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
    const { deps } = useContext(GlobalStateContext);
    const [verifyToken, , error, data] = useAsyncCallback(async (hash) => {
        const response = await deps.apiService.verifyUser({ verificationHash: hash });
        return response;
    }, []);

    const verifyTokenRef = useRef(verifyToken);
    useEffect(() => {
        const handleVerifyToken = async () => {
            if (verificationHash && isAuthenticated) {
                await Auth.signOut();
                return verifyTokenRef.current(verificationHash);
            }
            if (verificationHash && isAuthenticated === false) {
                verifyTokenRef.current(verificationHash);
            }
            return null;
        };
        handleVerifyToken();
    }, [verificationHash, isAuthenticated]);
    return { isAuthenticated, verificationHash, error, data };
};

export const useSignUp = (requestBody) => {
    const { deps } = useContext(GlobalStateContext);
    const [signUp, loading, error, data] = useAsyncCallback(async () => {
        const response = await deps.apiService.signUp(requestBody);
        return response;
    }, [requestBody]);

    return { error, data, loading, signUp };
};

export const useVerifyEmail = (email) => {
    const { deps } = useContext(GlobalStateContext);
    const [verifyEmail, loading, error] = useAsyncCallback(async () => {
        const response = await deps.apiService.verifyEmail({ emailAddress: email });
        return response;
    }, []);

    return { error, loading, verifyEmail };
};
