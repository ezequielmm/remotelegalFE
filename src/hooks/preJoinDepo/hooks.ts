import React from "react";
import { UserInfo } from "../../models/user";
import { GlobalStateContext } from "../../state/GlobalState";
import useAsyncCallback from "../useAsyncCallback";

export const useCheckUserStatus = () => {
    const { deps } = React.useContext(GlobalStateContext);

    return useAsyncCallback<any, any, (depositionID: string, email: string) => Promise<UserInfo>>(
        async (depositionID, email) => {
            const userStatus = await deps.apiService.checkUserDepoStatus(depositionID, email);
            return userStatus;
        },
        []
    );
};

export const useRegisterParticipant = () => {
    const { deps } = React.useContext(GlobalStateContext);

    return useAsyncCallback(async (depositionID, payload) => {
        const registeredParticipant = await deps.apiService.registerDepoParticipant(depositionID, payload);
        return registeredParticipant;
    }, []);
};
