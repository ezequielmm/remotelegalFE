import { Reducer } from "react";
import { TranscriptionModel } from "../../models";
import { IAction } from "../types";
import { ACTION_TYPE } from "./PostDepoActions";
import { setTranscriptionMessages } from "../../helpers/formatTranscriptionsMessages";
import { IDeposition } from "../../models/deposition";

export interface IPostDepo {
    currentTime: number;
    changeTime: { time: number };
    transcriptions?: (TranscriptionModel.Transcription & TranscriptionModel.TranscriptionPause)[];
    transcriptionsWithoutEvents?: TranscriptionModel.Transcription[];
    currentDeposition?: IDeposition;
    playing: boolean;
    duration: number;
}

export const PostDepoReducerInitialState: IPostDepo = {
    currentTime: undefined,
    changeTime: { time: undefined },
    transcriptions: [],
    transcriptionsWithoutEvents: [],
    currentDeposition: null,
    playing: false,
    duration: 0,
};

const PostDepoReducer: Reducer<IPostDepo, IAction> = (state: IPostDepo, action: IAction): IPostDepo => {
    switch (action.type) {
        case ACTION_TYPE.SET_TRANSCRIPTIONS:
            return {
                ...state,
                transcriptions: setTranscriptionMessages(action.payload.transcriptions, action.payload.events, true),
                transcriptionsWithoutEvents: action.payload.transcriptions,
            };
        case ACTION_TYPE.SET_DEPOSITION:
            return {
                ...state,
                currentDeposition: action.payload,
            };
        case ACTION_TYPE.SET_PLAYING:
            return { ...state, playing: action.payload.playing };
        case ACTION_TYPE.SET_DURATION:
            return { ...state, duration: action.payload.duration };
        case ACTION_TYPE.SET_CURRENT_TIME:
            return { ...state, currentTime: action.payload.currentTime };
        case ACTION_TYPE.SET_CHANGE_TIME:
            return { ...state, changeTime: { time: action.payload.changeTime } };
        case ACTION_TYPE.RESET_VIDEO_DATA:
            return { ...state, playing: false, duration: 0, currentTime: undefined, changeTime: { time: undefined } };
        default:
            return state;
    }
};

export default PostDepoReducer;
