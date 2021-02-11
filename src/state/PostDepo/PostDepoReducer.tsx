import { Reducer } from "react";
import { TranscriptionModel } from "../../models";
import { IAction } from "../types";
import { ACTION_TYPE } from "./PostDepoActions";
import { setTranscriptionMessages } from "../../helpers/formatTranscriptionsMessages";

export interface IPostDepo {
    transcriptions?: (TranscriptionModel.Transcription & TranscriptionModel.TranscriptionPause)[];
}

export const PostDepoReducerInitialState: IPostDepo = {
    transcriptions: [],
};

const PostDepoReducer: Reducer<IPostDepo, IAction> = (state: IPostDepo, action: IAction): IPostDepo => {
    switch (action.type) {
        case ACTION_TYPE.SET_TRANSCRIPTIONS:
            return {
                ...state,
                transcriptions: setTranscriptionMessages(action.payload.transcriptions, action.payload.events, true),
            };

        default:
            return state;
    }
};

export default PostDepoReducer;
