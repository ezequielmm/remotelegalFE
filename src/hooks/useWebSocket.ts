import { useEffect, useState } from "react";
import ENV from "../constants/env";
import useAsyncCallback from "./useAsyncCallback";
import React from "react";
import { GlobalStateContext } from "../state/GlobalState";

const useWebSocket = (url: string, onMessage: (evt: MessageEvent) => void, withAuth?: boolean) => {
    const [ws, setWs] = useState<WebSocket>(null);
    const { deps } = React.useContext(GlobalStateContext);

    useEffect(() => {
        return () => {
            if (ws !== null && ws.readyState === ws.CLOSED && ws.readyState === ws.CLOSED) ws.close();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [connectWebSocket] = useAsyncCallback<any, any, (...args: any[]) => Promise<WebSocket>>(
        async (extraUrl: string = "") => {
            const auth = withAuth ? `token=${await deps.apiService.getTokenSet()}&` : "";
            const newWs = new WebSocket(`${ENV.API.WS_URL}${url}?${auth}${extraUrl}`);
            newWs.binaryType = "arraybuffer";
            newWs.onmessage = onMessage;
            return newWs;
        },
        [onMessage, url]
    );

    const [sendMessage] = useAsyncCallback(
        async ({ message, extraUrl }: { message: ArrayBuffer | string; extraUrl: string }) => {
            if (ws === null || ws.readyState === ws.CLOSED || ws.readyState === ws.CLOSED) {
                const newWs: WebSocket = await connectWebSocket(extraUrl || "");
                newWs.onopen = () => newWs.send(message);
                setWs(newWs);
                return;
            }
            ws.send(message);
        },
        [connectWebSocket, ws]
    );

    return [sendMessage, connectWebSocket];
};

export default useWebSocket;
