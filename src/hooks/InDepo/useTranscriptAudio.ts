import moment from "moment-timezone";
import { useMemo, useContext } from "react";
import { GlobalStateContext } from "../../state/GlobalState";
import actions from "../../state/InDepo/InDepoActions";
import ENV from "../../constants/env";
import useAsyncCallback from "../useAsyncCallback";

const useTranscriptAudio = () => {
    const { dispatch, state } = useContext(GlobalStateContext);
    const { dataTrack, currentRoom } = state.room;
    const ws = useMemo(() => new WebSocket(`${ENV.API.WS_URL}/transcriptions`), []);
    ws.binaryType = "arraybuffer";

    ws.onmessage = (evt) => {
        const { text } = JSON.parse(evt.data);
        if (!text) return;
        const time = moment();
        const parsedTranscription = {
            text,
            participantName: currentRoom?.localParticipant?.identity,
            time: time.toString(),
        };
        dataTrack.send(
            JSON.stringify({
                module: "addTranscription",
                value: parsedTranscription,
            })
        );
        dispatch(actions.addTranscription(parsedTranscription));
    };

    return useAsyncCallback(
        // async (audio: Blob) => {
        //     ws.send(audio);
        // },
        async (audio: ArrayBuffer) => {
            // console.log(audio);
            ws.send(audio);
        },
        [dataTrack, currentRoom]
    );
};

export default useTranscriptAudio;
