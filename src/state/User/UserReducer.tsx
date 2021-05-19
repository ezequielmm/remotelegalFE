import { Reducer } from "react";
import { IAction } from "../types";
import { ACTION_TYPE } from "./UserActions";
import { IUser } from "../../models/user";

export interface IUserReducer {
    currentUser?: IUser;
}

export const UserReducerInitialState: IUserReducer = {
    currentUser: null,
};

const UserReducer: Reducer<IUserReducer, IAction> = (state: IUserReducer, action: IAction): IUserReducer => {
    switch (action.type) {
        case ACTION_TYPE.SET_CURRENT_USER:
            return {
                ...state,
                currentUser: action.payload,
            };

        default:
            return state;
    }
};

export default UserReducer;
