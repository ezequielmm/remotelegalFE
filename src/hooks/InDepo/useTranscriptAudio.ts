import { useContext, useEffect } from "react";
import { useParams } from "react-router";
import { GlobalStateContext } from "../../state/GlobalState";
import { DepositionID } from "../../state/types";
import useAsyncCallback from "../useAsyncCallback";
import useSignalR from "../useSignalR";
import ENV from "../../constants/env";
import { TranscriptionsContext } from "../../state/Transcriptions/TranscriptionsContext";

const useTranscriptAudio = (doNotConnectToSocket = false, sampleRate: number) => {
    const { dispatch, state } = useContext(GlobalStateContext);
    const { addNewTranscription } = useContext(TranscriptionsContext);
    const { isRecording } = state.room;
    const { depositionID } = useParams<DepositionID>();
    const { TRANSCRIPT_URL } = ENV.API;
    const transcriptHubUrl = `/transcriptionHub?depositionId=${depositionID}`;
    const { sendMessage, unsubscribeMethodFromGroup, subscribeToGroup, signalR } = useSignalR(
        transcriptHubUrl,
        TRANSCRIPT_URL,
        true,
        doNotConnectToSocket,
        true
    );

    useEffect(() => {
        if (signalR?.connectionState === "Connected" && depositionID) {
            sendMessage("SubscribeToDeposition", { depositionId: depositionID });
        }
    }, [signalR, depositionID, sendMessage]);

    useEffect(() => {
        if (!signalR) {
            return undefined;
        }
        return () => {
            signalR.stop();
        };
    }, [signalR]);

    useEffect(() => {
        if (sendMessage && signalR && sampleRate) {
            sendMessage("ChangeTranscriptionStatus", {
                sampleRate,
                depositionId: depositionID,
                offRecord: !isRecording,
            });
        }
    }, [sendMessage, isRecording, signalR, depositionID]);

    useEffect(() => {
        let manageReceiveNotification;
        if (dispatch && signalR && unsubscribeMethodFromGroup && subscribeToGroup) {
            manageReceiveNotification = (message) => {
                const { id, transcriptDateTime, text, userName } = message.content;
                if (!text) return;
                const parsedTranscription = {
                    id,
                    text,
                    userName,
                    transcriptDateTime:
                        Array.isArray(transcriptDateTime) && transcriptDateTime.length > 0
                            ? new Date(transcriptDateTime[0])
                            : transcriptDateTime,
                };
                addNewTranscription(parsedTranscription);
            };
            subscribeToGroup("ReceiveNotification", manageReceiveNotification);
        }
        return () => {
            if (manageReceiveNotification) unsubscribeMethodFromGroup("ReceiveNotification", manageReceiveNotification);
        };
    }, [signalR, subscribeToGroup, dispatch, unsubscribeMethodFromGroup, addNewTranscription]);

    const [transcriptAudio] = useAsyncCallback(
        async (audio: ArrayBuffer) => {
            sendMessage("UploadTranscription", {
                depositionId: depositionID,
                audio: new Uint8Array(audio),
            });
        },
        [sendMessage]
    );

    return { transcriptAudio, sendMessage };
};

export default useTranscriptAudio;
