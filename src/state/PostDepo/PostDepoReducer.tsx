import { Reducer } from "react";
import { TranscriptionModel } from "../../models";
import { IAction } from "../types";
import { ACTION_TYPE } from "./PostDepoActions";
import { setTranscriptionMessages } from "../../helpers/formatTranscriptionsMessages";
import { IDeposition } from "../../models/deposition";

export interface IPostDepo {
    transcriptions?: (TranscriptionModel.Transcription & TranscriptionModel.TranscriptionPause)[];
    currentDeposition?: IDeposition;
}

export const PostDepoReducerInitialState: IPostDepo = {
    transcriptions: [],
    currentDeposition: null,
};

const PostDepoReducer: Reducer<IPostDepo, IAction> = (state: IPostDepo, action: IAction): IPostDepo => {
    switch (action.type) {
        case ACTION_TYPE.SET_TRANSCRIPTIONS:
            return {
                ...state,
                transcriptions: setTranscriptionMessages(action.payload.transcriptions, action.payload.events, true),
            };
        case ACTION_TYPE.SET_DEPOSITION:
            return {
                ...state,
                currentDeposition: action.payload,
            };

        default:
            return state;
    }
};

export default PostDepoReducer;
