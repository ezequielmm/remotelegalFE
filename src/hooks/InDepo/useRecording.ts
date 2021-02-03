import { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { GlobalStateContext } from "../../state/GlobalState";
import { DepositionID } from "../../state/types";
import useAsyncCallback from "../useAsyncCallback";
import actions from "../../state/InDepo/InDepoActions";

const useRecording = (recording: boolean) => {
    const { state, dispatch } = useContext(GlobalStateContext);
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
            dispatch(actions.addTranscription(res));
            dataTrack.send(JSON.stringify({ module: "recordDepo", value: res }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataTrack, record, res]);

    return { startPauseRecording, loadingStartPauseRecording };
};
export default useRecording;
