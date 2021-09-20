import { LocalDataTrack, LocalTrack, Participant, Room } from "twilio-video";
import { Core } from "@pdftron/webviewer";
import { TimeZones } from "../../models/general";
import { DataTrackMessage, DisconnectRoomState } from "../types";
import { BreakroomModel } from "../../models";
import { EXHIBIT_TAB } from "../../constants/exhibits";
import { ExhibitFile } from "../../types/ExhibitFile";

export enum ACTION_TYPE {
    ADD_STAMP = "ADD_STAMP",
    IN_DEPO_RECONNECTING = "IN_DEPO_RECONNECTING",
    STOP_RECORDER = "STOP_RECORDER",
    RESET_RECORDER = "RESET_RECORDER",
    CHANGE_VIDEO_SOURCE = "CHANGE_VIDEO_SOURCE",
    CHANGE_AUDIO_SOURCE = "CHANGE_AUDIO_SOURCE",
    ADD_SYSTEM_SETTINGS = "ADD_SYSTEM_SETTINGS",
    SET_PUBLISHED_AUDIO_TRACK_STATUS = "SET_PUBLISHED_AUDIO_TRACK_STATUS",
    CHANGE_SPEAKER = "CHANGE_SPEAKER",
    SEND_MESSAGE = "SEND_MESSAGE",
    SET_INITIAL_CAMERA_STATUS = "SET_INITIAL_CAMERA_STATUS",
    SET_DEPO_START_TIME = "SET_DEPO_START_TIME",
    IN_DEPO_JOIN_TO_ROOM = "IN_DEPO_JOIN_TO_ROOM",
    IN_DEPO_JOIN_TO_BREAKROOM = "IN_DEPO_JOIN_TO_BREAKROOM",
    IN_DEPO_DISCONNECT = "IN_DEPO_DISCONNECT",
    IN_DEPO_ADD_PARTICIPANT = "IN_DEPO_ADD_PARTICIPANT",
    IN_DEPO_REMOVE_PARTICIPANT = "IN_DEPO_REMOVE_PARTICIPANT",
    IN_DEPO_ADD_PARTICIPANT_BREAKROOM = "IN_DEPO_ADD_PARTICIPANT_BREAKROOM",
    IN_DEPO_REMOVE_PARTICIPANT_BREAKROOM = "IN_DEPO_REMOVE_PARTICIPANT_BREAKROOM",
    IN_DEPO_ADD_DATA_TRACK = "IN_DEPO_ADD_DATA_TRACK",
    IN_DEPO_ADD_BREAKROOM_DATA_TRACK = "IN_DEPO_ADD_BREAKROOM_DATA_TRACK",
    IN_DEPO_START_SHARE_EXHIBIT = "IN_DEPO_START_SHARE_EXHIBIT",
    IN_DEPO_STOP_SHARE_EXHIBIT = "IN_DEPO_STOP_SHARE_EXHIBIT",
    IN_DEPO_SET_EXHIBIT_TAB_NAME = "IN_DEPO_SET_EXHIBIT_TAB_NAME",
    IN_DEPO_SET_CURRENT_EXHIBIT_PAGE = "IN_DEPO_SET_CURRENT_EXHIBIT_PAGE",
    IN_DEPO_SET_STAMP_LABEL = "IN_DEPO_SET_STAMP_LABEL",
    IN_DEPO_SET_EXHIBIT_DOCUMENT_INSTANCE = "IN_DEPO_SET_EXHIBIT_DOCUMENT_INSTANCE",
    IN_DEPO_SET_PARTICIPANTS_DATA = "IN_DEPO_SET_PARTICIPANTS_DATA",
    IN_DEPO_SET_TOKEN = "IN_DEPO_SET_TOKEN",
    IN_DEPO_SET_IS_MUTED = "IN_DEPO_SET_IS_MUTED",
    IN_DEPO_SET_JOB_NUMBER = "IN_DEPO_SET_JOB_NUMBER",
    ADD_WITNESS = "IN_DEPO_ADD_WITNESS",
    SET_TIMEZONE = "IN_DEPO_SET_TIMEZONE",
    IN_DEPO_SET_PERMISSIONS = "IN_DEPO_SET_PERMISSIONS",
    MOCK_DEPO_SET_ROOM = "MOCK_DEPO_SET_ROOM",
    SET_BREAKROOMS = "IN_DEPO_SET_BREAKROOMS",
    SET_IS_RECORDING = "IN_DEPO_SET_IS_RECORDING",
    CHANGE_EXHIBIT_TAB = "CHANGE_EXHIBIT_TAB",
    ADD_DOMINANT_SPEAKER = "ADD_DOMINANT_SPEAKER",
    SET_USER_STATUS = "SET_USER_STATUS",
    SET_DEPO_STATUS = "SET_DEPO_STATUS",
    ADD_USER_TRACKS = "ADD_USER_TRACKS",
}

const actions = {
    addDataTrack: (dataTrack: LocalDataTrack) => ({
        type: ACTION_TYPE.IN_DEPO_ADD_DATA_TRACK,
        payload: dataTrack,
    }),
    addUserTracks: (tracks: LocalTrack[]) => ({
        type: ACTION_TYPE.ADD_USER_TRACKS,
        payload: tracks,
    }),
    addStamp: (stamp: Element) => ({
        type: ACTION_TYPE.ADD_STAMP,
        payload: stamp,
    }),
    addBreakroomDataTrack: (dataTrack: LocalDataTrack) => ({
        type: ACTION_TYPE.IN_DEPO_ADD_BREAKROOM_DATA_TRACK,
        payload: dataTrack,
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
    setInDepoReconnecting: (payload: boolean) => ({
        type: ACTION_TYPE.IN_DEPO_RECONNECTING,
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
    removeRemoteParticipantBreakroom: (payload: Room) => ({
        type: ACTION_TYPE.IN_DEPO_REMOVE_PARTICIPANT_BREAKROOM,
        payload,
    }),
    setStampLabel: (label: string) => ({
        type: ACTION_TYPE.IN_DEPO_SET_STAMP_LABEL,
        payload: label,
    }),
    setExhibitDocument: (exhibitDocument: Core.Document, rawAnnotations: string) => ({
        type: ACTION_TYPE.IN_DEPO_SET_EXHIBIT_DOCUMENT_INSTANCE,
        payload: { exhibitDocument, rawAnnotations },
    }),
    setAddDominantSpeaker: (payload: Participant | null) => ({
        type: ACTION_TYPE.ADD_DOMINANT_SPEAKER,
        payload,
    }),
    setParticipantsData: (payload) => ({
        type: ACTION_TYPE.IN_DEPO_SET_PARTICIPANTS_DATA,
        payload,
    }),
    setDepoStartTime: (payload) => ({
        type: ACTION_TYPE.SET_DEPO_START_TIME,
        payload,
    }),
    setUserStatus: (payload) => ({
        type: ACTION_TYPE.SET_USER_STATUS,
        payload,
    }),
    setDepoStatus: (payload) => ({
        type: ACTION_TYPE.SET_DEPO_STATUS,
        payload,
    }),
    setCurrentExhibitPage: (payload) => ({
        type: ACTION_TYPE.IN_DEPO_SET_CURRENT_EXHIBIT_PAGE,
        payload,
    }),
    setToken: (payload) => ({
        type: ACTION_TYPE.IN_DEPO_SET_TOKEN,
        payload,
    }),
    setMockRoom: (payload) => ({
        type: ACTION_TYPE.MOCK_DEPO_SET_ROOM,
        payload,
    }),
    setIsMuted: (payload) => ({
        type: ACTION_TYPE.IN_DEPO_SET_IS_MUTED,
        payload,
    }),
    setJobNumber: (payload) => ({
        type: ACTION_TYPE.IN_DEPO_SET_JOB_NUMBER,
        payload,
    }),
    setInitialCameraStatus: (payload) => ({
        type: ACTION_TYPE.SET_INITIAL_CAMERA_STATUS,
        payload,
    }),
    changeSpeaker: (payload) => ({
        type: ACTION_TYPE.CHANGE_SPEAKER,
        payload,
    }),
    setPublishedAudioTrackStatus: (payload: boolean) => ({
        type: ACTION_TYPE.SET_PUBLISHED_AUDIO_TRACK_STATUS,
        payload,
    }),
    setSystemSettings: (payload) => ({
        type: ACTION_TYPE.ADD_SYSTEM_SETTINGS,
        payload,
    }),
    changeVideoSource: (payload: boolean) => ({
        type: ACTION_TYPE.CHANGE_VIDEO_SOURCE,
        payload,
    }),
    changeAudioSource: (payload: boolean) => ({
        type: ACTION_TYPE.CHANGE_AUDIO_SOURCE,
        payload,
    }),
    stopRecorder: (payload: boolean) => ({
        type: ACTION_TYPE.STOP_RECORDER,
        payload,
    }),
    resetRecorder: (payload: boolean) => ({
        type: ACTION_TYPE.RESET_RECORDER,
        payload,
    }),
};

export default actions;
