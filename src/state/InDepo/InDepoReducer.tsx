import { Reducer } from "react";
import { LocalDataTrack, LocalTrack, Participant, Room } from "twilio-video";
import { Core } from "@pdftron/webviewer";
import { TimeZones } from "../../models/general";
import { BreakroomModel } from "../../models";
import { IAction, DataTrackMessage } from "../types";
import { ACTION_TYPE } from "./InDepoActions";
import { ExhibitFile } from "../../types/ExhibitFile";
import { EXHIBIT_TAB } from "../../constants/exhibits";
import { UserInfo } from "../../models/user";
import { SystemSettings } from "../../models/systemsettings";

export interface IRoom {
    info?: object;
    depoRoomReconnecting?: boolean;
    systemSettings?: SystemSettings;
    newSpeaker?: string;
    stopRecorder?: boolean;
    resetRecorder?: boolean;
    changeAudioDevice?: MediaDeviceInfo;
    changeVideoSource?: boolean;
    changeAudioSource?: boolean;
    initialCameraStatus?: boolean;
    stamp?: Document;
    publishedAudioTrackStatus?: boolean;
    shouldSendToPreDepo?: boolean;
    userStatus?: UserInfo;
    startTime?: string;
    currentRoom?: Room;
    currentBreakroom?: Room;
    error?: string;
    tracks?: LocalTrack[];
    message?: DataTrackMessage;
    dataTrack?: LocalDataTrack | null;
    breakroomDataTrack?: LocalDataTrack | null;
    witness?: string;
    timeZone?: TimeZones;
    isRecording?: boolean;
    breakrooms?: BreakroomModel.Breakroom[];
    permissions?: string[];
    currentExhibit?: ExhibitFile;
    currentExhibitPage?: string;
    isCurrentExhibitOwner?: boolean;
    exhibitTab?: string | EXHIBIT_TAB;
    currentExhibitTabName?: string;
    myExhibits?: ExhibitFile[];
    rawAnnotations?: string;
    lastAnnotationId?: string;
    stampLabel?: string;
    exhibitDocument?: Core.Document;
    dominantSpeaker?: Participant | null;
    participants?: [];
    token: string;
    mockDepoRoom?: Room;
    isMuted?: boolean;
    jobNumber?: string;
    events?: [];
}

export const RoomReducerInitialState: IRoom = {
    info: null,
    depoRoomReconnecting: false,
    startTime: "",
    systemSettings: null,
    changeVideoSource: false,
    resetRecorder: false,
    stopRecorder: false,
    changeAudioDevice: null,
    changeAudioSource: false,
    publishedAudioTrackStatus: null,
    stamp: null,
    mockDepoRoom: null,
    shouldSendToPreDepo: null,
    initialCameraStatus: null,
    userStatus: null,
    currentRoom: null,
    newSpeaker: null,
    dominantSpeaker: null,
    currentBreakroom: null,
    error: "",
    tracks: [],
    dataTrack: null,
    breakroomDataTrack: null,
    message: { module: "", value: "" },
    isRecording: null,
    timeZone: null,
    permissions: [],
    currentExhibit: null,
    currentExhibitPage: null,
    isCurrentExhibitOwner: false,
    exhibitTab: "myExhibits",
    currentExhibitTabName: "",
    myExhibits: [],
    lastAnnotationId: "",
    stampLabel: "",
    exhibitDocument: null,
    participants: [],
    token: null,
    isMuted: false,
    jobNumber: "",
    events: [],
};

const RoomReducer: Reducer<IRoom, IAction> = (state: IRoom, action: IAction): IRoom => {
    switch (action.type) {
        case ACTION_TYPE.IN_DEPO_ADD_DATA_TRACK:
            return {
                ...state,
                dataTrack: action.payload,
            };
        case ACTION_TYPE.IN_DEPO_ADD_BREAKROOM_DATA_TRACK:
            return {
                ...state,
                breakroomDataTrack: action.payload,
            };
        case ACTION_TYPE.IN_DEPO_SET_PERMISSIONS:
            return {
                ...state,
                permissions: action.payload,
            };

        case ACTION_TYPE.SET_BREAKROOMS:
            return {
                ...state,
                breakrooms: action.payload,
            };
        case ACTION_TYPE.ADD_WITNESS:
            return {
                ...state,
                witness: action.payload,
            };
        case ACTION_TYPE.IN_DEPO_JOIN_TO_ROOM:
            return {
                ...state,
                currentRoom: action.payload,
            };
        case ACTION_TYPE.IN_DEPO_JOIN_TO_BREAKROOM:
            return {
                ...state,
                currentBreakroom: action.payload,
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
        case ACTION_TYPE.IN_DEPO_ADD_PARTICIPANT_BREAKROOM:
            return {
                ...state,
                currentBreakroom: action.payload,
            };
        case ACTION_TYPE.IN_DEPO_REMOVE_PARTICIPANT_BREAKROOM:
            return {
                ...state,
                currentBreakroom: action.payload,
            };
        case ACTION_TYPE.SET_TIMEZONE:
            return {
                ...state,
                timeZone: action.payload,
            };
        case ACTION_TYPE.IN_DEPO_SET_TOKEN:
            return {
                ...state,
                token: action.payload,
            };
        case ACTION_TYPE.ADD_STAMP:
            return {
                ...state,
                stamp: action.payload,
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
        case ACTION_TYPE.IN_DEPO_SET_MY_EXHIBITS:
            return {
                ...state,
                myExhibits: action.payload,
            };
        case ACTION_TYPE.IN_DEPO_STOP_SHARE_EXHIBIT:
            return {
                ...state,
                currentExhibit: null,
                exhibitDocument: null,
                currentExhibitPage: null,
                isCurrentExhibitOwner: false,
                stampLabel: "",
                lastAnnotationId: "",
            };
        case ACTION_TYPE.ADD_SYSTEM_SETTINGS:
            return {
                ...state,
                systemSettings: action.payload,
            };
        case ACTION_TYPE.IN_DEPO_SET_EXHIBIT_TAB_NAME:
            return {
                ...state,
                currentExhibitTabName: action.payload,
            };
        case ACTION_TYPE.IN_DEPO_SET_STAMP_LABEL:
            return {
                ...state,
                stampLabel: action.payload,
            };
        case ACTION_TYPE.IN_DEPO_SET_EXHIBIT_DOCUMENT_INSTANCE:
            return {
                ...state,
                exhibitDocument: action.payload.exhibitDocument,
                rawAnnotations: action.payload.rawAnnotations ?? state.rawAnnotations,
            };
        case ACTION_TYPE.ADD_DOMINANT_SPEAKER:
            return {
                ...state,
                dominantSpeaker: action.payload,
            };
        case ACTION_TYPE.IN_DEPO_SET_PARTICIPANTS_DATA:
            return {
                ...state,
                participants: action.payload,
            };
        case ACTION_TYPE.SET_DEPO_START_TIME:
            return {
                ...state,
                startTime: action.payload,
            };
        case ACTION_TYPE.SET_USER_STATUS:
            return {
                ...state,
                userStatus: action.payload,
            };
        case ACTION_TYPE.SET_DEPO_STATUS:
            return {
                ...state,
                shouldSendToPreDepo: action.payload,
            };
        case ACTION_TYPE.IN_DEPO_SET_CURRENT_EXHIBIT_PAGE:
            return {
                ...state,
                currentExhibitPage: action.payload,
            };
        case ACTION_TYPE.MOCK_DEPO_SET_ROOM:
            return {
                ...state,
                mockDepoRoom: action.payload,
            };
        case ACTION_TYPE.IN_DEPO_SET_IS_MUTED:
            return {
                ...state,
                isMuted: action.payload,
            };

        case ACTION_TYPE.IN_DEPO_SET_JOB_NUMBER:
            return {
                ...state,
                jobNumber: action.payload,
            };
        case ACTION_TYPE.ADD_USER_TRACKS:
            return {
                ...state,
                tracks: action.payload,
            };
        case ACTION_TYPE.SET_INITIAL_CAMERA_STATUS:
            return {
                ...state,
                initialCameraStatus: action.payload,
            };
        case ACTION_TYPE.CHANGE_SPEAKER:
            return {
                ...state,
                newSpeaker: action.payload,
            };

        case ACTION_TYPE.SET_PUBLISHED_AUDIO_TRACK_STATUS:
            return {
                ...state,
                publishedAudioTrackStatus: action.payload,
            };

        case ACTION_TYPE.IN_DEPO_RECONNECTING:
            return {
                ...state,
                depoRoomReconnecting: action.payload,
            };

        case ACTION_TYPE.CHANGE_VIDEO_SOURCE:
            return {
                ...state,
                changeVideoSource: action.payload,
            };
        case ACTION_TYPE.CHANGE_AUDIO_SOURCE:
            return {
                ...state,
                changeAudioSource: action.payload,
            };
        case ACTION_TYPE.STOP_RECORDER:
            return {
                ...state,
                stopRecorder: action.payload,
            };
        case ACTION_TYPE.RESET_RECORDER:
            return {
                ...state,
                resetRecorder: action.payload,
            };

        case ACTION_TYPE.CHANGE_AUDIO_DEVICE:
            return {
                ...state,
                changeAudioDevice: action.payload,
            };
        case ACTION_TYPE.IN_DEPO_SET_EVENTS:
            return {
                ...state,
                events: action.payload,
            };

        default:
            return state;
    }
};

export default RoomReducer;
