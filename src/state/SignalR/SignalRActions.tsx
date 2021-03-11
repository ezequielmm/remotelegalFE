import { HubConnection } from "@microsoft/signalr";

export enum ACTION_TYPE {
    SET_SIGNAL_R = "SIGNAL_R_SET_SIGNAL_R",
}

const actions = {
    setSignalR: (signalR: HubConnection) => ({
        type: ACTION_TYPE.SET_SIGNAL_R,
        payload: { signalR },
    }),
};

export default actions;
