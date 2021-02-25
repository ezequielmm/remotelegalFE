import React from "react";
import { useParams } from "react-router";
import IRecording from "../models/recording";
import { GlobalStateContext } from "../state/GlobalState";
import useAsyncCallback from "./useAsyncCallback";

export const useGetRecordingInfo = (): {
    getRecordingInfo: () => void;
    recordingInfo: IRecording;
    pendingGetRecordingInfo: boolean;
    errorRecordingInfo: any;
} => {
    const { deps } = React.useContext(GlobalStateContext);
    const { depositionID } = useParams<{ depositionID: string }>();

    const [getRecordingInfo, pendingGetRecordingInfo, errorRecordingInfo, recordingInfo] = useAsyncCallback(
        async () => await deps.apiService.getRecordingInfo({ depositionID }),
        []
    );

    return {
        getRecordingInfo,
        recordingInfo,
        pendingGetRecordingInfo,
        errorRecordingInfo,
    };
};
