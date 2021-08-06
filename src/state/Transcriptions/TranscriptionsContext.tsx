import React, { useState, useEffect, useMemo, useContext, useCallback, useRef } from "react";
import { addTranscriptionMessages } from "../../helpers/formatTranscriptionsMessages";
import { TranscriptionModel } from "../../models";
import { GlobalStateContext } from "../GlobalState";

export const TranscriptionsContext = React.createContext<{
    transcriptions: TranscriptionModel.Transcription[];
    setTranscriptions: React.Dispatch<TranscriptionModel.Transcription[]>;
    addNewTranscription: (newTranscription: TranscriptionModel.Transcription, isRecording?: boolean) => void;
}>({
    transcriptions: [],
    setTranscriptions: null,
    addNewTranscription: null,
});

const TranscriptionsProvider = ({
    children,
    initialTranscriptions,
    setInitialTranscriptions,
}: {
    children: React.ReactNode;
    initialTranscriptions?: TranscriptionModel.Transcription[];
    setInitialTranscriptions?: React.Dispatch<[]>;
}) => {
    const { state } = useContext(GlobalStateContext);
    const { isRecording, message } = state.room;
    const [transcriptions, setTranscriptions] = useState<TranscriptionModel.Transcription[]>([]);
    const recordingRef = useRef(isRecording);

    useEffect(() => {
        recordingRef.current = isRecording;
    }, [isRecording]);

    useEffect(() => {
        if (initialTranscriptions?.length && setInitialTranscriptions) {
            setTranscriptions(initialTranscriptions);
            // We do this to delete the initial array from memory
            setInitialTranscriptions([]);
        }
    }, [initialTranscriptions, setInitialTranscriptions]);

    const addNewTranscription = useCallback(
        (newTranscription: TranscriptionModel.Transcription, isRecording?: boolean) => {
            setTranscriptions((oldTranscriptions) =>
                addTranscriptionMessages(
                    newTranscription,
                    oldTranscriptions,
                    isRecording !== undefined ? isRecording : recordingRef.current
                )
            );
        },
        []
    );

    useEffect(() => {
        if (message.module === "recordDepo") {
            addNewTranscription(message.value, message.recording);
        }
    }, [message, addNewTranscription]);

    const contextValue = useMemo(
        () => ({ transcriptions, setTranscriptions, addNewTranscription }),
        [transcriptions, setTranscriptions, addNewTranscription]
    );

    return <TranscriptionsContext.Provider value={contextValue}>{children}</TranscriptionsContext.Provider>;
};
export default TranscriptionsProvider;
