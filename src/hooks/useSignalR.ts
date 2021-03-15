import { HttpTransportType, HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import React, { useCallback, useEffect } from "react";
import ENV from "../constants/env";
import { GlobalStateContext } from "../state/GlobalState";
import actions from "../state/SignalR/SignalRActions";
import useAsyncCallback from "./useAsyncCallback";

const useSignalR = (url: string): any => {
    const { state, dispatch, deps } = React.useContext(GlobalStateContext);
    const { signalR }: { signalR: HubConnection } = state.signalR;

    const [connect] = useAsyncCallback(async () => {
        if (signalR !== null) return signalR;
        const token = await deps.apiService.getTokenSet();
        const newSignalR: HubConnection = new HubConnectionBuilder()
            .withUrl(`${ENV.API.URL}${url}`, {
                accessTokenFactory: () => token,
                skipNegotiation: true,
                transport: HttpTransportType.WebSockets,
            })
            .withAutomaticReconnect()
            .build();

        await newSignalR.start();
        dispatch(actions.setSignalR(newSignalR));
        return newSignalR;
    }, [dispatch, signalR, url]);

    useEffect(() => {
        if (connect) connect();
    }, [connect]);

    const stop = useCallback(() => {
        if (signalR === null) return null;

        signalR.stop();
        dispatch(actions.setSignalR(null));
        return null;
    }, [dispatch, signalR]);

    const sendMessage = useCallback((hub, message) => signalR.send(hub, message), [signalR]);

    const subscribeToGroup = useCallback((group, onMessage) => signalR.on(group, onMessage), [signalR]);

    const unsubscribeToGroup = useCallback((group) => signalR.off(group), [signalR]);

    return { connect, stop, sendMessage, subscribeToGroup, unsubscribeToGroup, signalR };
};

export default useSignalR;
