import { Reducer } from "react";
import moment from "moment-timezone";
import { LocalDataTrack, Room } from "twilio-video";
import { TimeZones } from "../../models/general";
import { TranscriptionModel } from "../../models";
import { IAction, DataTrackMessage } from "../types";
import { ACTION_TYPE } from "./InDepoActions";
import { ExhibitFile } from "../../types/ExhibitFile";
import { DEFAULT_ACTIVE_TAB, EXHIBIT_TAB } from "../../constants/exhibits";

export interface IRoom {
    info?: object;
    currentRoom?: Room;
    error?: string;
    message?: DataTrackMessage;
    dataTrack?: LocalDataTrack | null;
    timeZone?: TimeZones;
    isRecording?: boolean;
    transcriptions?: TranscriptionModel.Transcription[];
    permissions?: string[];
    currentExhibit?: ExhibitFile;
    isCurrentExhibitOwner?: boolean;
    exhibitTab?: EXHIBIT_TAB;
}

export const RoomReducerInitialState: IRoom = {
    info: null,
    currentRoom: null,
    error: "",
    dataTrack: null,
    message: { module: "", value: "" },
    isRecording: null,
    timeZone: null,
    transcriptions: [],
    permissions: [],
    currentExhibit: null,
    isCurrentExhibitOwner: false,
    exhibitTab: DEFAULT_ACTIVE_TAB,
};

const RoomReducer: Reducer<IRoom, IAction> = (state: IRoom, action: IAction): IRoom => {
    switch (action.type) {
        case ACTION_TYPE.IN_DEPO_ADD_DATA_TRACK:
            return {
                ...state,
                dataTrack: action.payload,
            };
        case ACTION_TYPE.IN_DEPO_ADD_TRANSCRIPTION: {
            const newTranscription = action.payload;
            if (newTranscription.text === "") return state;
            const laterTranscriptionIndex = state.transcriptions.findIndex((transcription) => {
                return moment(newTranscription.transcriptDateTime).isBefore(
                    moment(transcription.transcriptDateTime),
                    "second"
                );
            });
            const transcriptions =
                laterTranscriptionIndex === -1
                    ? [...state.transcriptions, newTranscription]
                    : [
                          ...state.transcriptions.slice(0, laterTranscriptionIndex),
                          newTranscription,
                          ...state.transcriptions.slice(laterTranscriptionIndex),
                      ];
            return {
                ...state,
                transcriptions,
            };
        }
        case ACTION_TYPE.IN_DEPO_SET_PERMISSIONS:
            return {
                ...state,
                permissions: action.payload,
            };
        case ACTION_TYPE.SET_TRANSCRIPTIONS:
            return {
                ...state,
                transcriptions: action.payload,
            };
        case ACTION_TYPE.IN_DEPO_JOIN_TO_ROOM:
            return {
                ...state,
                currentRoom: action.payload,
            };
        case ACTION_TYPE.SEND_MESSAGE:
            return {
                ...state,
                message: action.payload,
            };
        case ACTION_TYPE.IN_DEPO_DISCONNECT:
            return { ...state, ...action.payload };
        case ACTION_TYPE.IN_DEPO_ADD_PARTICIPANT:
            return {
                ...state,
                currentRoom: action.payload,
            };
        case ACTION_TYPE.IN_DEPO_REMOVE_PARTICIPANT:
            return {
                ...state,
                currentRoom: action.payload,
            };
        case ACTION_TYPE.SET_TIMEZONE:
            return {
                ...state,
                timeZone: action.payload,
            };
        case ACTION_TYPE.SET_IS_RECORDING:
            return {
                ...state,
                isRecording: action.payload,
            };

        case ACTION_TYPE.CHANGE_EXHIBIT_TAB:
            return {
                ...state,
                exhibitTab: action.payload,
            };
        case ACTION_TYPE.IN_DEPO_START_SHARE_EXHIBIT:
            return {
                ...state,
                currentExhibit: action.payload,
            };
        case ACTION_TYPE.IN_DEPO_STOP_SHARE_EXHIBIT:
            return {
                ...state,
                currentExhibit: null,
            };
        case ACTION_TYPE.IN_DEPO_SET_CURRENT_EXHIBIT_OWNER:
            return {
                ...state,
                isCurrentExhibitOwner: action.payload,
            };

        default:
            return state;
    }
};

export default RoomReducer;
