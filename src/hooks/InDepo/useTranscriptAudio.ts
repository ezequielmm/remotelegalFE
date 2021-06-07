import { useContext, useEffect } from "react";
import { useParams } from "react-router";
import { GlobalStateContext } from "../../state/GlobalState";
import actions from "../../state/InDepo/InDepoActions";
import { DepositionID } from "../../state/types";
import useAsyncCallback from "../useAsyncCallback";
import useSignalR from "../useSignalR";
import useWebSocket from "../useWebSocket";
import ENV from "../../constants/env";

const useTranscriptAudio = (doNotConnectToSocket = false) => {
    const { dispatch, state } = useContext(GlobalStateContext);
    const { isRecording } = state.room;
    const { depositionID } = useParams<DepositionID>();
    const { TRANSCRIPT_URL } = ENV.API;
    const { sendMessage: sendSignalRMessage, unsubscribeMethodFromGroup, subscribeToGroup, signalR } = useSignalR(
        "/transcriptionHub",
        TRANSCRIPT_URL,
        true,
        doNotConnectToSocket
    );

    useEffect(() => {
        if (signalR?.connectionState === "Connected" && depositionID) {
            sendSignalRMessage("SubscribeToDeposition", { depositionId: depositionID });
        }
    }, [signalR, depositionID, sendSignalRMessage]);

    useEffect(() => {
        if (!signalR) {
            return undefined;
        }
        return () => {
            signalR.stop();
        };
    }, [signalR]);

    useEffect(() => {
        let manageReceiveNotification;
        if (dispatch && signalR && unsubscribeMethodFromGroup && subscribeToGroup) {
            manageReceiveNotification = (message) => {
                const { id, transcriptDateTime, text, userName } = message.content;
                if (!text) return;
                const parsedTranscription = { id, text, userName, transcriptDateTime };
                dispatch(actions.addTranscription(parsedTranscription));
            };
            subscribeToGroup("ReceiveNotification", manageReceiveNotification);
        }
        return () => {
            if (manageReceiveNotification) unsubscribeMethodFromGroup("ReceiveNotification", manageReceiveNotification);
        };
    }, [signalR, subscribeToGroup, dispatch, unsubscribeMethodFromGroup]);

    const [sendMessage] = useWebSocket(`/transcriptions`, undefined, true);

    const [transcriptAudio] = useAsyncCallback(
        async (audio: ArrayBuffer | string, newSampleRate: number, reconnect: boolean) => {
            if (isRecording) {
                sendMessage({
                    message: audio,
                    extraUrl: `depositionId=${depositionID}&sampleRate=${newSampleRate}`,
                    reconnect,
                });
            }
        },
        [isRecording, sendMessage]
    );

    const [stopAudio] = useAsyncCallback(
        async (newSampleRate: number) => {
            sendMessage({
                message: JSON.stringify({ offRecord: true }),
                extraUrl: `depositionId=${depositionID}&sampleRate=${newSampleRate}`,
            });
        },
        [sendMessage]
    );

    return [stopAudio, transcriptAudio];
};

export default useTranscriptAudio;
