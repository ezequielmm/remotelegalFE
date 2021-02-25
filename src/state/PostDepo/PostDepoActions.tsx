import { EventModel, TranscriptionModel } from "../../models";

export enum ACTION_TYPE {
    SET_TRANSCRIPTIONS = "POST_DEPO_ADD_TRANSCRIPTION",
    SET_DEPOSITION = "POST_DEPO_SET_DEPOSITION",
}

const actions = {
    setTranscriptions: (payload: {
        transcriptions?: TranscriptionModel.Transcription[];
        events?: EventModel.IEvent[];
    }) => ({
        type: ACTION_TYPE.SET_TRANSCRIPTIONS,
        payload,
    }),
    setDeposition: (payload) => ({ type: ACTION_TYPE.SET_DEPOSITION, payload }),
};

export default actions;
