import { Reducer } from "react";
import { IAction } from "../types";
import { ACTION_TYPE } from "./UserPermissionsActions";

export interface IUserPermissions {
    isAdmin: boolean;
}

export const UserPermissionsReducerInitialState: IUserPermissions = {
    isAdmin: undefined,
};

const UserPermissionsReducer: Reducer<IUserPermissions, IAction> = (
    state: IUserPermissions,
    action: IAction
): IUserPermissions => {
    switch (action.type) {
        case ACTION_TYPE.USER_PERMISSIONS_IS_ADMIN: {
            return {
                ...state,
                isAdmin: action.payload.isAdmin,
            };
        }
        default:
            return state;
    }
};

export default UserPermissionsReducer;
