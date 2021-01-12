import { useCallback, useContext, useEffect } from "react";
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

    const [record, loading, , res] = useAsyncCallback(async (id: string, onRecord: boolean) => {
        const response = await deps.apiService.recordDeposition(id, onRecord);
        return response;
    }, []);

    const startPauseRecording = useCallback(() => {
        if (loading) {
            return;
        }

        record(depositionID, recording);
    }, [loading, depositionID, recording, record]);

    useEffect(() => {
        if (res) {
            dispatch(actions.setIsRecoding(recording));
            dataTrack.send(JSON.stringify({ module: "recordDepo", value: recording }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataTrack, record, res]);

    return startPauseRecording;
};
export default useRecording;
