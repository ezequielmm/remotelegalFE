import { Reducer } from "react";
import { HubConnection } from "@microsoft/signalr";
import { IAction } from "../types";
import { ACTION_TYPE } from "./SignalRActions";

export interface ISignalR {
    signalR?: HubConnection;
}

export const SignalRReducerInitialState: ISignalR = {
    signalR: null,
};

const SignalRReducer: Reducer<ISignalR, IAction> = (state: ISignalR, action: IAction): ISignalR => {
    switch (action.type) {
        case ACTION_TYPE.SET_SIGNAL_R:
            return {
                ...state,
                signalR: action.payload.signalR,
            };
        default:
            return state;
    }
};

export default SignalRReducer;
