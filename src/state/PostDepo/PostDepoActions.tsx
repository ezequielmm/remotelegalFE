import { EventModel, TranscriptionModel } from "../../models";

export enum ACTION_TYPE {
    SET_TRANSCRIPTIONS = "POST_DEPO_ADD_TRANSCRIPTION",
    SET_DEPOSITION = "POST_DEPO_SET_DEPOSITION",
    SET_PLAYING = "SET_PLAYING",
    SET_DURATION = "SET_DURATION",
    SET_CHANGE_TIME = "SET_CHANGE_TIME",
    SET_CURRENT_TIME = "SET_CURRENT_TIME",
    RESET_VIDEO_DATA = "RESET_VIDEO_DATA",
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
    setVideoPlayerProgress: (payload: {
        transcriptions?: TranscriptionModel.Transcription[];
        events?: EventModel.IEvent[];
    }) => ({
        type: ACTION_TYPE.SET_TRANSCRIPTIONS,
        payload,
    }),
    setPlaying: (playing: boolean) => ({
        type: ACTION_TYPE.SET_PLAYING,
        payload: { playing },
    }),
    setDuration: (duration: number) => ({
        type: ACTION_TYPE.SET_DURATION,
        payload: { duration },
    }),
    setCurrentTime: (currentTime: number) => ({
        type: ACTION_TYPE.SET_CURRENT_TIME,
        payload: { currentTime },
    }),
    setChangeTime: (changeTime: number) => ({
        type: ACTION_TYPE.SET_CHANGE_TIME,
        payload: { changeTime },
    }),
    resetVideoData: () => ({
        type: ACTION_TYPE.RESET_VIDEO_DATA,
    }),
};

export default actions;
