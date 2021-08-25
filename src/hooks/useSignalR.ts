import { HttpTransportType, HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import React, { useCallback, useEffect, useState } from "react";
import { MessagePackHubProtocol } from "@microsoft/signalr-protocol-msgpack";
import { datadogLogs } from "@datadog/browser-logs";
import ENV from "../constants/env";
import { GlobalStateContext } from "../state/GlobalState";
import actions from "../state/SignalR/SignalRActions";
import useAsyncCallback from "./useAsyncCallback";

const useSignalR = (
    url: string,
    baseUrl?: string,
    setNewSignalRInstance?: boolean,
    doNotConnectToSocket?: boolean,
    useMessageProtocol?: boolean
): any => {
    const { state, dispatch, deps } = React.useContext(GlobalStateContext);
    const { signalR }: { signalR: HubConnection } = state.signalR;
    const [newSignalRInstance, setNewSignalR] = useState<HubConnection>(null);
    const [isReconnected, setIsReconnected] = useState(false);

    const [connect] = useAsyncCallback(async () => {
        if (doNotConnectToSocket) {
            return null;
        }

        if ((!setNewSignalRInstance && signalR !== null) || newSignalRInstance) {
            return newSignalRInstance || signalR;
        }
        const token = await deps.apiService.getTokenSet();
        let newSignalR: HubConnection = null;
        const baseSignalRConfig = new HubConnectionBuilder()
            .withUrl(`${baseUrl ?? ENV.API.URL}${url}`, {
                accessTokenFactory: () => token,
                skipNegotiation: true,
                transport: HttpTransportType.WebSockets,
            })
            .withAutomaticReconnect([0, 2000, 10000, 30000, 60000, 120000])
            .configureLogging({
                log: (logLevel, message) => {
                    if (logLevel >= LogLevel.Error) {
                        datadogLogs.logger.error(
                            `SignalR logLevel: ${LogLevel[logLevel]}. Hub: ${url}, message: ${message}`,
                            {
                                hub: url,
                                message,
                                logLevel: LogLevel[logLevel],
                            }
                        );
                    }
                },
            });

        newSignalR = useMessageProtocol
            ? baseSignalRConfig.withHubProtocol(new MessagePackHubProtocol()).build()
            : baseSignalRConfig.build();

        newSignalR.onclose((error) => {
            if (error) {
                datadogLogs.logger.error(`SignalR onClose in hub: ${url} with error: ${error}`, { hub: url, error });
            } else {
                datadogLogs.logger.info(`SingalR onClose in hub: ${url}`, { url });
            }
        });

        newSignalR.onreconnecting((error) => {
            setIsReconnected(false);
            if (error) {
                datadogLogs.logger.error(`SingalR Reconnecting in hub: ${url} with error: ${error}`, {
                    hub: url,
                    error,
                });
            } else {
                datadogLogs.logger.info(`SingalR Reconnecting in hub: ${url}`, { hub: url });
            }
        });

        newSignalR.onreconnected((connectionId) => {
            setIsReconnected(true);
            datadogLogs.logger.info(`SignalR Reconnected in hub: ${url} with connectionId: ${connectionId}`, {
                connectionId,
                hub: url,
            });
        });

        try {
            await newSignalR.start();
        } catch (error) {
            datadogLogs.logger.error(`SignalR start in hub: ${url} with error: ${error}`, { hub: url, error });
        }
        if (setNewSignalRInstance) {
            setNewSignalR(newSignalR);
            return newSignalRInstance;
        }
        dispatch(actions.setSignalR(newSignalR));
        return newSignalR;
    }, [dispatch, signalR, url]);

    useEffect(() => {
        if (connect) connect();
    }, [connect]);

    const sendMessage = useCallback(
        (hub, message) => {
            const signalRInstance: any = setNewSignalRInstance ? newSignalRInstance : signalR;
            if (signalRInstance?.connectionState === "Connected") {
                return signalRInstance.send(hub, message);
            }
            return datadogLogs.logger.error(
                `tried to send message without being connected in:${hub} with the following message: ${JSON.stringify(
                    message
                )}`,
                { hub, message }
            );
        },
        [setNewSignalRInstance, newSignalRInstance, signalR]
    );

    const subscribeToGroup = useCallback(
        (group, onMessage) =>
            setNewSignalRInstance ? newSignalRInstance?.on(group, onMessage) : signalR?.on(group, onMessage),
        [setNewSignalRInstance, newSignalRInstance, signalR]
    );

    const unsubscribeToGroup = useCallback(
        (group) => (setNewSignalRInstance ? newSignalRInstance?.off(group) : signalR?.off(group)),
        [setNewSignalRInstance, newSignalRInstance, signalR]
    );

    const unsubscribeMethodFromGroup = useCallback(
        (group, method) =>
            setNewSignalRInstance ? newSignalRInstance?.off(group, method) : signalR?.off(group, method),
        [setNewSignalRInstance, newSignalRInstance, signalR]
    );

    return {
        connect,
        isReconnected,
        sendMessage,
        subscribeToGroup,
        unsubscribeToGroup,
        unsubscribeMethodFromGroup,
        signalR: setNewSignalRInstance ? newSignalRInstance : signalR,
    };
};

export default useSignalR;
