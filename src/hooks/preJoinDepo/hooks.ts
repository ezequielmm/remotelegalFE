import { Auth } from "aws-amplify";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import TEMP_TOKEN from "../../constants/ApiService";
import { UserInfo } from "../../models/user";
import { GlobalStateContext } from "../../state/GlobalState";
import useAsyncCallback from "../useAsyncCallback";
import * as ERRORS from "../../constants/login";
import * as CONSTANTS from "../../constants/preJoinDepo";
import { useAuthentication } from "../auth";
import Message from "../../components/Message";
import { addParticipantBody } from "../../types/PreJoinDepo";

export const useCheckUserStatus = () => {
    const { deps } = React.useContext(GlobalStateContext);

    return useAsyncCallback<any, any, (depositionID: string, email: string) => Promise<UserInfo>>(
        async (depositionID, email) => deps.apiService.checkUserDepoStatus(depositionID, email),
        []
    );
};

export const useRegisterParticipant = () => {
    const { deps } = React.useContext(GlobalStateContext);

    return useAsyncCallback(
        async (depositionID, payload) => deps.apiService.registerGuestDepoParticipant(depositionID, payload),

        []
    );
};

export const useAddParticipant = () => {
    const { deps } = React.useContext(GlobalStateContext);
    return useAsyncCallback(async (depoID, payload) => deps.apiService.addDepoParticipant(depoID, payload), []);
};

export const useLogin = (depositionID: string) => {
    const [loginError, setLoginError] = useState("");
    const [addParticipant, , addParticipantError, addParticipantInfo] = useAddParticipant();
    const [loading, setLoading] = useState(false);
    const { isAuthenticated } = useAuthentication();
    const history = useHistory();

    useEffect(() => {
        if (addParticipantError) {
            setLoading(false);

            if (addParticipantError !== 400) {
                Message({
                    content: CONSTANTS.NETWORK_ERROR,
                    type: "error",
                    duration: 3,
                });
            }
        }
    }, [addParticipantError]);

    useEffect(() => {
        if (addParticipantInfo) {
            history.push(`/deposition/join/${depositionID}`);
        }
    }, [addParticipantInfo, history, depositionID]);

    const loginUser = async (emailValue: string, passwordValue: string, body?: addParticipantBody) => {
        setLoginError("");
        setLoading(true);
        try {
            if (!isAuthenticated) {
                await Auth.signIn(emailValue.trim(), passwordValue);
                localStorage.removeItem(TEMP_TOKEN);
            }
            return body
                ? addParticipant(depositionID, body)
                : history.push(`${CONSTANTS.DEPOSITION_ROUTE}${depositionID}`);
        } catch (e) {
            await Auth.signOut();
            setLoading(false);
            return setLoginError(ERRORS.AWS_ERRORS[e.message] || ERRORS.NETWORK_ERROR);
        }
    };

    return { loginUser, loading, loginError, addParticipantError };
};
