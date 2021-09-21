import { useContext, useEffect } from "react";
import { useParams } from "react-router";
import { HubConnectionState } from "@microsoft/signalr";
import { GlobalStateContext } from "../../state/GlobalState";
import { WindowSizeContext } from "../../contexts/WindowSizeContext";
import { DepositionID } from "../../state/types";
import { WindowSizeContext } from "../../contexts/WindowSizeContext";
import useAsyncCallback from "../useAsyncCallback";
import useSignalR from "../useSignalR";
import ENV from "../../constants/env";
import { IS_MOBILE_OR_TABLET } from "../../constants/general";
import { TranscriptionsContext } from "../../state/Transcriptions/TranscriptionsContext";
import { IS_MOBILE_OR_TABLET } from "../../constants/general";

const useTranscriptAudio = (doNotConnectToSocket = false, sampleRate: number) => {
    const { dispatch, state } = useContext(GlobalStateContext);
    const [windowWidth] = useContext(WindowSizeContext);
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
        if (signalR?.connectionState === HubConnectionState.Connected && depositionID) {
            sendMessage("SubscribeToDeposition", { depositionId: depositionID });
        }
    }, [signalR?.connectionState, depositionID, sendMessage]);

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
    }, [sendMessage, isRecording, signalR, depositionID, sampleRate]);

    useEffect(() => {
        const isMobileOrTablet = windowWidth <= IS_MOBILE_OR_TABLET;
        let manageReceiveNotification;
        if (dispatch && signalR && unsubscribeMethodFromGroup && subscribeToGroup && !isMobileOrTablet) {
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
    }, [signalR, subscribeToGroup, dispatch, unsubscribeMethodFromGroup, addNewTranscription, windowWidth]);

    const [transcriptAudio] = useAsyncCallback(
        async (audio: ArrayBuffer, sampleRate: number) => {
            sendMessage("UploadTranscription", {
                depositionId: depositionID,
                audio: new Uint8Array(audio),
                sampleRate,
            });
        },
        [sendMessage]
    );

    return { transcriptAudio, sendMessage };
};

export default useTranscriptAudio;
