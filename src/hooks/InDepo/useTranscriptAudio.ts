import { useContext } from "react";
import { useParams } from "react-router";
import { GlobalStateContext } from "../../state/GlobalState";
import actions from "../../state/InDepo/InDepoActions";
import { DepositionID } from "../../state/types";
import useAsyncCallback from "../useAsyncCallback";
import useWebSocket from "../useWebSocket";

const useTranscriptAudio = () => {
    const { dispatch, state } = useContext(GlobalStateContext);
    const { dataTrack, currentRoom } = state.room;
    const { depositionID } = useParams<DepositionID>();

    const [sendAudio] = useAsyncCallback(
        async (evt) => {
            const { id, transcriptDateTime, text } = JSON.parse(evt.data);
            if (!text) return;
            const parsedTranscription = {
                id,
                text,
                userName: JSON.parse(currentRoom?.localParticipant?.identity)?.name,
                transcriptDateTime,
            };
            dataTrack.send(
                JSON.stringify({
                    module: "addTranscription",
                    value: parsedTranscription,
                })
            );
            dispatch(actions.addTranscription(parsedTranscription));
        },
        [currentRoom, dataTrack, dispatch]
    );

    const [sendMessage] = useWebSocket(`/transcriptions`, sendAudio, true);

    const [transcriptAudio] = useAsyncCallback(
        async (audio: ArrayBuffer | string, sampleRate: number) => {
            sendMessage({ message: audio, extraUrl: `depositionId=${depositionID}&sampleRate=${sampleRate}` });
        },
        [sendMessage]
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
