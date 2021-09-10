import { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { GlobalStateContext } from "../../state/GlobalState";
import { DepositionID } from "../../state/types";
import useAsyncCallback from "../useAsyncCallback";
import actions from "../../state/InDepo/InDepoActions";
import { TranscriptionsContext } from "../../state/Transcriptions/TranscriptionsContext";

const useRecording = (recording: boolean, EnableLiveTranscriptions: string) => {
    const { state, dispatch } = useContext(GlobalStateContext);
    const { addNewTranscription } = useContext(TranscriptionsContext);
    const { dataTrack } = state.room;
    const { deps } = useContext(GlobalStateContext);
    const { depositionID } = useParams<DepositionID>();
    const [loadingStartPauseRecording, setLoadingStartPauseRecording] = useState<boolean>(false);

    const [record, loading, , res] = useAsyncCallback(async (id: string, onRecord: boolean) => {
        const response = await deps.apiService.recordDeposition(id, onRecord);
        return response;
    }, []);

    useEffect(() => {
        let delay;
        if (loading) {
            setLoadingStartPauseRecording(true);
        } else {
            delay = setTimeout(() => setLoadingStartPauseRecording(false), 1000);
        }
        return () => clearTimeout(delay);
    }, [loading]);

    const startPauseRecording = useCallback(() => {
        if (loading) {
            return;
        }

        record(depositionID, recording);
    }, [loading, depositionID, recording, record]);

    useEffect(() => {
        if (res) {
            dispatch(actions.setIsRecording(recording));
            if (EnableLiveTranscriptions === "enabled") addNewTranscription(res, recording);
            dataTrack.send(JSON.stringify({ module: "recordDepo", value: res, recording }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataTrack, record, res, addNewTranscription]);

    return { startPauseRecording, loadingStartPauseRecording };
};
export default useRecording;
