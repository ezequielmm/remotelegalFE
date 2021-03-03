import { LocalDataTrack, Room } from "twilio-video";
import { TimeZones } from "../../models/general";
import { DataTrackMessage, DisconnectRoomState } from "../types";
import { EventModel, TranscriptionModel, BreakroomModel } from "../../models";
import { EXHIBIT_TAB } from "../../constants/exhibits";
import { CoreControls } from "@pdftron/webviewer";
import { ExhibitFile } from "../../types/ExhibitFile";

export enum ACTION_TYPE {
    SEND_MESSAGE = "SEND_MESSAGE",
    IN_DEPO_JOIN_TO_ROOM = "IN_DEPO_JOIN_TO_ROOM",
    IN_DEPO_JOIN_TO_BREAKROOM = "IN_DEPO_JOIN_TO_BREAKROOM",
    IN_DEPO_DISCONNECT = "IN_DEPO_DISCONNECT",
    IN_DEPO_ADD_PARTICIPANT = "IN_DEPO_ADD_PARTICIPANT",
    IN_DEPO_REMOVE_PARTICIPANT = "IN_DEPO_REMOVE_PARTICIPANT",
    IN_DEPO_ADD_PARTICIPANT_BREAKROOM = "IN_DEPO_ADD_PARTICIPANT_BREAKROOM",
    IN_DEPO_REMOVE_PARTICIPANT_BREAKROOM = "IN_DEPO_REMOVE_PARTICIPANT_BREAKROOM",
    IN_DEPO_ADD_DATA_TRACK = "IN_DEPO_ADD_DATA_TRACK",
    IN_DEPO_ADD_BREAKROOM_DATA_TRACK = "IN_DEPO_ADD_BREAKROOM_DATA_TRACK",
    IN_DEPO_ADD_TRANSCRIPTION = "IN_DEPO_ADD_TRANSCRIPTION",
    IN_DEPO_START_SHARE_EXHIBIT = "IN_DEPO_START_SHARE_EXHIBIT",
    IN_DEPO_STOP_SHARE_EXHIBIT = "IN_DEPO_STOP_SHARE_EXHIBIT",
    IN_DEPO_SET_EXHIBIT_TAB_NAME = "IN_DEPO_SET_EXHIBIT_TAB_NAME",
    IN_DEPO_SET_EXHIBIT_ANNOTATIONS = "IN_DEPO_SET_EXHIBIT_ANNOTATIONS",
    IN_DEPO_SET_CURRENT_USER = "IN_DEPO_SET_CURRENT_USER",
    IN_DEPO_SET_STAMP_LABEL = "IN_DEPO_SET_STAMP_LABEL",
    IN_DEPO_SET_EXHIBIT_DOCUMENT_INSTANCE = "IN_DEPO_SET_EXHIBIT_DOCUMENT_INSTANCE",
    ADD_WITNESS = "IN_DEPO_ADD_WITNESS",
    SET_TIMEZONE = "IN_DEPO_SET_TIMEZONE",
    IN_DEPO_SET_PERMISSIONS = "IN_DEPO_SET_PERMISSIONS",
    SET_TRANSCRIPTIONS = "IN_DEPO_SET_TRANSCRIPTIONS",
    SET_BREAKROOMS = "IN_DEPO_SET_BREAKROOMS",
    SET_IS_RECORDING = "IN_DEPO_SET_IS_RECORDING",
    CHANGE_EXHIBIT_TAB = "CHANGE_EXHIBIT_TAB",
}

const actions = {
    addDataTrack: (dataTrack: LocalDataTrack) => ({
        type: ACTION_TYPE.IN_DEPO_ADD_DATA_TRACK,
        payload: dataTrack,
    }),

    addBreakroomDataTrack: (dataTrack: LocalDataTrack) => ({
        type: ACTION_TYPE.IN_DEPO_ADD_BREAKROOM_DATA_TRACK,
        payload: dataTrack,
    }),
    addTranscription: (transcription: TranscriptionModel.Transcription | EventModel.IEvent) => ({
        type: ACTION_TYPE.IN_DEPO_ADD_TRANSCRIPTION,
        payload: transcription,
    }),
    joinToRoom: (payload: Room) => ({
        type: ACTION_TYPE.IN_DEPO_JOIN_TO_ROOM,
        payload,
    }),
    joinToBreakroom: (payload: Room) => ({
        type: ACTION_TYPE.IN_DEPO_JOIN_TO_BREAKROOM,
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
    addRemoteParticipantBreakroom: (payload: Room) => ({
        type: ACTION_TYPE.IN_DEPO_ADD_PARTICIPANT_BREAKROOM,
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
    setIsRecording: (payload: boolean) => ({
        type: ACTION_TYPE.SET_IS_RECORDING,
        payload,
    }),
    setTranscriptions: (payload: {
        transcriptions: TranscriptionModel.Transcription[];
        events: EventModel.IEvent[];
    }) => ({
        type: ACTION_TYPE.SET_TRANSCRIPTIONS,
        payload,
    }),
    setBreakrooms: (payload: BreakroomModel.Breakroom[]) => ({
        type: ACTION_TYPE.SET_BREAKROOMS,
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
    setExhibitTabName: (payload: string) => ({
        type: ACTION_TYPE.IN_DEPO_SET_EXHIBIT_TAB_NAME,
        payload,
    }),
    setExhibitAnnotations: (payload) => ({
        type: ACTION_TYPE.IN_DEPO_SET_EXHIBIT_ANNOTATIONS,
        payload,
    }),
    removeRemoteParticipantBreakroom: (payload: Room) => ({
        type: ACTION_TYPE.IN_DEPO_REMOVE_PARTICIPANT_BREAKROOM,
        payload,
    }),
    setCurrentUser: (payload) => ({
        type: ACTION_TYPE.IN_DEPO_SET_CURRENT_USER,
        payload,
    }),
    setStampLabel: (label: string) => ({
        type: ACTION_TYPE.IN_DEPO_SET_STAMP_LABEL,
        payload: label,
    }),
    setExhibitDocument: (exhibitDocument: CoreControls.Document, rawAnnotations: string) => ({
        type: ACTION_TYPE.IN_DEPO_SET_EXHIBIT_DOCUMENT_INSTANCE,
        payload: { exhibitDocument, rawAnnotations },
    }),
};

export default actions;
