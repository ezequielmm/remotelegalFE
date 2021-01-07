import { useState, useEffect } from "react";
import ENV from "../constants/env";
import useAsyncCallback from "./useAsyncCallback";
import { Auth } from "aws-amplify";

const useWebSocket = (
    url: string,
    onMessage: (evt: MessageEvent) => void,
    withAuth: boolean = false,
    extraUrl: string = ""
) => {
    const [ws, setWs] = useState<WebSocket>(null);

    useEffect(() => {
        return () => {
            if (ws !== null && ws.readyState === ws.CLOSED && ws.readyState === ws.CLOSED) ws.close();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [connectWebSocket] = useAsyncCallback<any, any, () => Promise<WebSocket>>(async () => {
        const auth = withAuth ? `token=${(await Auth.currentSession()).getIdToken().getJwtToken()}&` : "";
        const newWs = new WebSocket(`${ENV.API.WS_URL}${url}?${auth}${extraUrl}`);
        newWs.binaryType = "arraybuffer";
        newWs.onmessage = onMessage;
        return newWs;
    }, [onMessage, url]);

    const [sendMessage] = useAsyncCallback(
        async (audio: ArrayBuffer | string) => {
            if (ws === null || ws.readyState === ws.CLOSED || ws.readyState === ws.CLOSED) {
                const newWs: WebSocket = await connectWebSocket();
                newWs.onopen = () => newWs.send(audio);
                setWs(newWs);
                return;
            }
            ws.send(audio);
        },
        [connectWebSocket, ws]
    );

    return [sendMessage, connectWebSocket];
};

export default useWebSocket;
