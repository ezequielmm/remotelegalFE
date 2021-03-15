/* eslint-disable import/prefer-default-export */
import React from "react";
import actions from "../../state/UserPermissions/UserPermissionsActions";
import { GlobalStateContext } from "../../state/GlobalState";
import useAsyncCallback from "../useAsyncCallback";

export const useUserIsAdmin = () => {
    const { deps, dispatch, state } = React.useContext(GlobalStateContext);
    const { isAdmin } = state.userPermissions;

    const [fetchFiles, loading, errorFetchFiles] = useAsyncCallback(async () => {
        if (isAdmin !== undefined) return isAdmin;
        const user = await deps.apiService.currentUser();
        dispatch(actions.setIsAdmin(user.isAdmin));
        return user.isAdmin;
    }, []);

    return [fetchFiles, loading, errorFetchFiles, isAdmin];
};
