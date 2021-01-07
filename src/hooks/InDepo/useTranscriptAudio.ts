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
            const { date, text } = JSON.parse(evt.data);
            if (!text) return;
            const parsedTranscription = {
                text,
                participantName: currentRoom?.localParticipant?.identity,
                time: date,
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

    const [sendMessage] = useWebSocket(`/transcriptions`, sendAudio, true, `depositionId=${depositionID}`);

    const [transcriptAudio] = useAsyncCallback(
        async (audio: ArrayBuffer | string) => {
            sendMessage(audio);
        },
        [sendMessage]
    );

    return transcriptAudio;
};

export default useTranscriptAudio;
