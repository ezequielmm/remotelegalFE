import { Reducer } from "react";
import { HubConnection } from "@microsoft/signalr";
import { IAction } from "../types";
import { ACTION_TYPE } from "./SignalRActions";

export interface ISignalR {
    signalR?: HubConnection;
    signalRConnectionStatus?: { isReconnected: boolean; isReconnecting: boolean };
}

export const SignalRReducerInitialState: ISignalR = {
    signalR: null,
    signalRConnectionStatus: { isReconnected: false, isReconnecting: false },
};

const SignalRReducer: Reducer<ISignalR, IAction> = (state: ISignalR, action: IAction): ISignalR => {
    switch (action.type) {
        case ACTION_TYPE.SET_SIGNAL_R:
            return {
                ...state,
                signalR: action.payload.signalR,
            };
        case ACTION_TYPE.SET_SIGNAL_R_CONNECTION_STATUS:
            return {
                ...state,
                signalRConnectionStatus: action.payload.connectionStatus,
            };
        default:
            return state;
    }
};

export default SignalRReducer;
