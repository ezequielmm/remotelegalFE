/* eslint-disable import/prefer-default-export */
import { Deps } from "../../models/general";
import { getCaseAsc, getOneCase } from "../constants/cases";
import {
    getWaitingRoomParticipants,
    JOIN_BREAKROOM_MOCK,
    JOIN_DEPOSITION_MOCK,
    PERMISSIONS_MOCK,
} from "../constants/InDepo";
import { getDepositions } from "../constants/depositions";
import { getUser1 } from "../constants/signUp";
import { getEvents, getRecordResponse, getTranscription, getTranscriptionsWithOffset } from "../mocks/transcription";
import { CAPTION_MOCK } from "../constants/caption";
import { getBreakrooms } from "../mocks/breakroom";
import { getTranscriptFileList } from "../mocks/transcriptsFileList";
import { MOCKED_EMAIL } from "../constants/changePassword";
import fileUrlList from "../mocks/fileUrlList";
import { getUserDepoStatusWithoutParticipant } from "../constants/preJoinDepo";

export default (): Deps => ({
    apiService: {
        fetchCaption: jest.fn().mockResolvedValue(CAPTION_MOCK),
        recordDeposition: jest.fn().mockResolvedValue(getRecordResponse(true)),
        joinResponse: jest.fn().mockResolvedValue(true),
        joinDeposition: jest.fn().mockResolvedValue(JOIN_DEPOSITION_MOCK),
        joinBreakroom: jest.fn().mockResolvedValue(JOIN_BREAKROOM_MOCK),
        getDepositionBreakrooms: jest.fn().mockResolvedValue(getBreakrooms()),
        getDepositionTranscriptions: jest.fn().mockResolvedValue([getTranscription()]),
        getDepositionTranscriptionsWithOffsets: jest.fn().mockResolvedValue(getTranscriptionsWithOffset()),
        getDepositionEvents: jest.fn().mockResolvedValue(getEvents()),
        checkUserDepoStatus: jest.fn().mockResolvedValue(getUserDepoStatusWithoutParticipant(false)),
        waitingRoomParticipants: jest.fn().mockResolvedValue(getWaitingRoomParticipants()),
        getDepositionPermissions: jest.fn().mockResolvedValue({ permissions: PERMISSIONS_MOCK }),
        fetchCases: jest.fn().mockResolvedValue(getCaseAsc()),
        fetchDeposition: jest.fn().mockRejectedValue(getDepositions()[0]),
        fetchDepositions: jest.fn().mockResolvedValue(getDepositions()),
        createCase: jest.fn().mockResolvedValue(getOneCase()[0]),
        createDepositions: jest.fn().mockResolvedValue(true),
        signUp: jest.fn().mockResolvedValue(getUser1()),
        currentUser: jest.fn().mockResolvedValue(getUser1()),
        verifyPasswordToken: jest.fn().mockResolvedValue({ email: MOCKED_EMAIL }),
        changePassword: jest.fn().mockResolvedValue(true),
        forgotPassword: jest.fn().mockResolvedValue(true),
        verifyUser: jest.fn().mockResolvedValue(true),
        verifyEmail: jest.fn().mockResolvedValue(true),
        addDepoParticipant: jest.fn().mockResolvedValue(true),
        getRecordingInfo: jest.fn().mockResolvedValue(true),
        getEnteredExhibits: jest.fn().mockResolvedValue([]),
        fetchTranscriptsFiles: jest.fn().mockResolvedValue(getTranscriptFileList()),
        getDocumentsUrlList: jest.fn().mockResolvedValue(fileUrlList),
    } as any,
});
