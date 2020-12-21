/* eslint-disable import/prefer-default-export */
import React from "react";
import { GlobalStateContext } from "../../state/GlobalState";
import useAsyncCallback from "../useAsyncCallback";

export const useUserIsAdmin = () => {
    const { deps } = React.useContext(GlobalStateContext);

    return useAsyncCallback(async () => {
        const user = await deps.apiService.currentUser();
        return user.isAdmin;
    }, []);
};
