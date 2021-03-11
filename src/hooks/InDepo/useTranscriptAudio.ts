import { useContext, useEffect } from "react";
import { useParams } from "react-router";
import { GlobalStateContext } from "../../state/GlobalState";
import actions from "../../state/InDepo/InDepoActions";
import { DepositionID } from "../../state/types";
import useAsyncCallback from "../useAsyncCallback";
import useSignalR from "../useSignalR";
import useWebSocket from "../useWebSocket";

const useTranscriptAudio = () => {
    const { dispatch, state } = useContext(GlobalStateContext);
    const { isRecording } = state.room;
    const { depositionID } = useParams<DepositionID>();
    const { subscribeToGroup, signalR } = useSignalR("/depositionHub");

    useEffect(() => {
        if (dispatch && signalR) {
            subscribeToGroup("ReceiveNotification", (message) => {
                const { id, transcriptDateTime, text, userName } = message.content;
                if (!text) return;
                const parsedTranscription = { id, text, userName, transcriptDateTime };
                dispatch(actions.addTranscription(parsedTranscription));
            });
        }
    }, [signalR, subscribeToGroup, dispatch]);

    const [sendMessage] = useWebSocket(`/transcriptions`, undefined, true);

    const [transcriptAudio] = useAsyncCallback(
        async (audio: ArrayBuffer | string, sampleRate: number) => {
            if (isRecording)
                sendMessage({ message: audio, extraUrl: `depositionId=${depositionID}&sampleRate=${sampleRate}` });
        },
        [isRecording, sendMessage]
    );

    const [stopAudio] = useAsyncCallback(
        async (sampleRate: number) => {
            sendMessage({
                message: JSON.stringify({ offRecord: true }),
                extraUrl: `depositionId=${depositionID}&sampleRate=${sampleRate}`,
            });
        },
        [sendMessage]
    );

    return [stopAudio, transcriptAudio];
};

export default useTranscriptAudio;
