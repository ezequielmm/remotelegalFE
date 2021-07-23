import { useContext, useEffect } from "react";
import { useParams } from "react-router";
import { GlobalStateContext } from "../../state/GlobalState";
import actions from "../../state/InDepo/InDepoActions";
import { DepositionID } from "../../state/types";
import useAsyncCallback from "../useAsyncCallback";
import useSignalR from "../useSignalR";
import ENV from "../../constants/env";

const useTranscriptAudio = (doNotConnectToSocket = false) => {
    const { dispatch, state } = useContext(GlobalStateContext);
    const { isRecording } = state.room;
    const { depositionID } = useParams<DepositionID>();
    const { TRANSCRIPT_URL } = ENV.API;
    const transcriptHubUrl = `/transcriptionHub?depositionId=${depositionID}&sampleRate=48000`;
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
        if (sendMessage && signalR) {
            sendMessage("ChangeTranscriptionStatus", {
                offRecord: !isRecording,
            });
        }
    }, [sendMessage, isRecording, signalR]);

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
                dispatch(actions.addTranscription(parsedTranscription));
            };
            subscribeToGroup("ReceiveNotification", manageReceiveNotification);
        }
        return () => {
            if (manageReceiveNotification) unsubscribeMethodFromGroup("ReceiveNotification", manageReceiveNotification);
        };
    }, [signalR, subscribeToGroup, dispatch, unsubscribeMethodFromGroup]);

    const [transcriptAudio] = useAsyncCallback(
        async (audio: ArrayBuffer) => {
            sendMessage("UploadTranscription", {
                depositionId: depositionID,
                sampleRate: 48000, // TODO: This is a hardcoded value, but is the recommended value for high quality audio (48Khz) Same for the url in line #15
                audio: new Uint8Array(audio),
            });
        },
        [sendMessage]
    );

    return transcriptAudio;
};

export default useTranscriptAudio;
