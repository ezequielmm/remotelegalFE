import { LocalDataTrack, Room } from "twilio-video";
import { TimeZones } from "../../models/general";
import { DataTrackMessage, DisconnectRoomState } from "../types";
import { TranscriptionModel } from "../../models";
import { ExhibitFile } from "../../types/ExhibitFile";
import { EXHIBIT_TAB } from "../../constants/exhibits";

export enum ACTION_TYPE {
    SEND_MESSAGE = "SEND_MESSAGE",
    IN_DEPO_JOIN_TO_ROOM = "IN_DEPO_JOIN_TO_ROOM",
    IN_DEPO_DISCONNECT = "IN_DEPO_DISCONNECT",
    IN_DEPO_ADD_PARTICIPANT = "IN_DEPO_ADD_PARTICIPANT",
    IN_DEPO_REMOVE_PARTICIPANT = "IN_DEPO_REMOVE_PARTICIPANT",
    IN_DEPO_ADD_DATA_TRACK = "IN_DEPO_ADD_DATA_TRACK",
    IN_DEPO_ADD_TRANSCRIPTION = "IN_DEPO_ADD_TRANSCRIPTION",
    IN_DEPO_START_SHARE_EXHIBIT = "IN_DEPO_START_SHARE_EXHIBIT",
    IN_DEPO_STOP_SHARE_EXHIBIT = "IN_DEPO_STOP_SHARE_EXHIBIT",
    IN_DEPO_SET_CURRENT_EXHIBIT_OWNER = "IN_DEPO_SET_CURRENT_EXHIBIT_OWNER",
    ADD_WITNESS = "IN_DEPO_ADD_WITNESS",
    SET_TIMEZONE = "IN_DEPO_SET_TIMEZONE",
    IN_DEPO_SET_PERMISSIONS = "IN_DEPO_SET_PERMISSIONS",
    SET_TRANSCRIPTIONS = "IN_DEPO_SET_TRANSCRIPTIONS",
    SET_IS_RECORDING = "IN_DEPO_SET_IS_RECORDING",
    CHANGE_EXHIBIT_TAB = "CHANGE_EXHIBIT_TAB",
}

const actions = {
    addDataTrack: (dataTrack: LocalDataTrack) => ({
        type: ACTION_TYPE.IN_DEPO_ADD_DATA_TRACK,
        payload: dataTrack,
    }),

    addTranscription: ({ text, userEmail, userName, transcriptDateTime }: TranscriptionModel.Transcription) => ({
        type: ACTION_TYPE.IN_DEPO_ADD_TRANSCRIPTION,
        payload: {
            text,
            userEmail,
            userName,
            transcriptDateTime,
        },
    }),

    joinToRoom: (payload: Room) => ({
        type: ACTION_TYPE.IN_DEPO_JOIN_TO_ROOM,
        payload,
    }),
    sendMessage: (payload: DataTrackMessage) => ({
        type: ACTION_TYPE.SEND_MESSAGE,
        payload,
    }),
    disconnect: (payload: DisconnectRoomState) => ({
        type: ACTION_TYPE.IN_DEPO_DISCONNECT,
        payload,
    }),
    setPermissions: (payload: string[]) => ({
        type: ACTION_TYPE.IN_DEPO_SET_PERMISSIONS,
        payload,
    }),
    addRemoteParticipant: (payload: Room) => ({
        type: ACTION_TYPE.IN_DEPO_ADD_PARTICIPANT,
        payload,
    }),
    setTimeZone: (payload: TimeZones) => ({
        type: ACTION_TYPE.SET_TIMEZONE,
        payload,
    }),
    setIsRecoding: (payload: boolean) => ({
        type: ACTION_TYPE.SET_IS_RECORDING,
        payload,
    }),
    setTranscriptions: (payload: TranscriptionModel.Transcription[]) => ({
        type: ACTION_TYPE.SET_TRANSCRIPTIONS,
        payload,
    }),
    removeRemoteParticipant: (payload: Room) => ({
        type: ACTION_TYPE.IN_DEPO_REMOVE_PARTICIPANT,
        payload,
    }),
    setActiveTab: (payload: EXHIBIT_TAB) => ({
        type: ACTION_TYPE.CHANGE_EXHIBIT_TAB,
        payload,
    }),
    setSharedExhibit: (payload: ExhibitFile) => ({
        type: ACTION_TYPE.IN_DEPO_START_SHARE_EXHIBIT,
        payload,
    }),
    stopShareExhibit: () => ({
        type: ACTION_TYPE.IN_DEPO_STOP_SHARE_EXHIBIT,
        payload: null,
    }),
    setIsCurrentExhibitOwner: (payload: boolean) => ({
        type: ACTION_TYPE.IN_DEPO_SET_CURRENT_EXHIBIT_OWNER,
        payload,
    }),
};

export default actions;
