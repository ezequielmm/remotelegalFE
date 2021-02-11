import { EventModel, TranscriptionModel } from "../../models";

export enum ACTION_TYPE {
    SET_TRANSCRIPTIONS = "POST_DEPO_ADD_TRANSCRIPTION",
}

const actions = {
    setTranscriptions: (payload: {
        transcriptions?: TranscriptionModel.Transcription[];
        events?: EventModel.IEvent[];
    }) => ({
        type: ACTION_TYPE.SET_TRANSCRIPTIONS,
        payload,
    }),
};

export default actions;
