import { HubConnection } from "@microsoft/signalr";

export enum ACTION_TYPE {
    SET_SIGNAL_R = "SIGNAL_R_SET_SIGNAL_R",
    SET_SIGNAL_R_CONNECTION_STATUS = "SET_SIGNAL_R_CONNECTION_STATUS",
}

const actions = {
    setSignalR: (signalR: HubConnection) => ({
        type: ACTION_TYPE.SET_SIGNAL_R,
        payload: { signalR },
    }),
    setSignalRConnectionStatus: (connectionStatus: { isReconnected: boolean; isReconnecting: boolean }) => ({
        type: ACTION_TYPE.SET_SIGNAL_R_CONNECTION_STATUS,
        payload: { connectionStatus },
    }),
};

export default actions;
