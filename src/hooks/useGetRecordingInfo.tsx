import React from "react";
import { useParams } from "react-router";
import IRecording from "../models/recording";
import { GlobalStateContext } from "../state/GlobalState";
import useAsyncCallback from "./useAsyncCallback";

// eslint-disable-next-line import/prefer-default-export
export const useGetRecordingInfo = (): {
    getRecordingInfo: () => void;
    recordingInfo: IRecording;
    pendingGetRecordingInfo: boolean;
    errorRecordingInfo: any;
} => {
    const { deps } = React.useContext(GlobalStateContext);
    const { depositionID } = useParams<{ depositionID: string }>();

    const [getRecordingInfo, pendingGetRecordingInfo, errorRecordingInfo, recordingInfo] = useAsyncCallback(
        async () => deps.apiService.getRecordingInfo({ depositionID }),
        []
    );

    return {
        getRecordingInfo,
        recordingInfo,
        pendingGetRecordingInfo,
        errorRecordingInfo,
    };
};
