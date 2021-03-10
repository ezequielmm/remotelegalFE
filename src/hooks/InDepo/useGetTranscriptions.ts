import { useContext } from "react";
import { useParams } from "react-router";
import { TranscriptionModel } from "../../models";
import { GlobalStateContext } from "../../state/GlobalState";
import { DepositionID } from "../../state/types";
import useAsyncCallback from "../useAsyncCallback";

const useGetTranscriptions = (withOffset: boolean = false) => {
    const { depositionID } = useParams<DepositionID>();
    const { deps } = useContext(GlobalStateContext);
    return useAsyncCallback<any, any, () => Promise<TranscriptionModel.Transcription[]>>(async () => {
        const response = await deps.apiService[
            withOffset ? "getDepositionTranscriptionsWithOffsets" : "getDepositionTranscriptions"
        ](depositionID);
        return response;
    }, []);
};
export default useGetTranscriptions;
