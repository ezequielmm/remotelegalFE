import { LocalDataTrack, Room } from "twilio-video";
import { TimeZones } from "../../models/general";
import { DataTrackMessage, DisconnectRoomState } from "../types";
import { TranscriptionModel } from "../../models";

export enum ACTION_TYPE {
    SEND_MESSAGE = "SEND_MESSAGE",
    IN_DEPO_JOIN_TO_ROOM = "IN_DEPO_JOIN_TO_ROOM",
    IN_DEPO_DISCONNECT = "IN_DEPO_DISCONNECT",
    IN_DEPO_ADD_PARTICIPANT = "IN_DEPO_ADD_PARTICIPANT",
    IN_DEPO_REMOVE_PARTICIPANT = "IN_DEPO_REMOVE_PARTICIPANT",
    IN_DEPO_ADD_DATA_TRACK = "IN_DEPO_ADD_DATA_TRACK",
    IN_DEPO_ADD_TRANSCRIPTION = "IN_DEPO_ADD_TRANSCRIPTION",
    ADD_WITNESS = "IN_DEPO_ADD_WITNESS",
    SET_TIMEZONE = "IN_DEPO_SET_TIMEZONE",
    IN_DEPO_SET_PERMISSIONS = "IN_DEPO_SET_PERMISSIONS",
    SET_TRANSCRIPTIONS = "IN_DEPO_SET_TRANSCRIPTIONS",
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
    addWitness: (payload: string) => ({
        type: ACTION_TYPE.ADD_WITNESS,
        payload,
    }),
    setTimeZone: (payload: TimeZones) => ({
        type: ACTION_TYPE.SET_TIMEZONE,
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
};

export default actions;
