/* eslint-disable import/prefer-default-export */
import { Deps } from "../../models/general";
import { getCaseAsc, getOneCase } from "../constants/cases";
import { JOIN_BREAKROOM_MOCK, JOIN_DEPOSITION_MOCK, PERMISSIONS_MOCK } from "../constants/InDepo";
import { getDepositions } from "../constants/depositions";
import { getUser1 } from "../constants/signUp";
import { getEvents, getRecordResponse, getTranscription, getTranscriptionsWithOffset } from "../mocks/transcription";
import { CAPTION_MOCK } from "../constants/caption";
import { getBreakrooms } from "../mocks/breakroom";

export default (): Deps => ({
    apiService: {
        fetchCaption: jest.fn().mockResolvedValue(CAPTION_MOCK),
        recordDeposition: jest.fn().mockResolvedValue(getRecordResponse(true)),
        joinDeposition: jest.fn().mockResolvedValue(JOIN_DEPOSITION_MOCK),
        joinBreakroom: jest.fn().mockResolvedValue(JOIN_BREAKROOM_MOCK),
        getDepositionBreakrooms: jest.fn().mockResolvedValue(getBreakrooms()),
        getDepositionTranscriptions: jest.fn().mockResolvedValue([getTranscription()]),
        getDepositionTranscriptionsWithOffsets: jest.fn().mockResolvedValue(getTranscriptionsWithOffset()),
        getDepositionEvents: jest.fn().mockResolvedValue(getEvents()),
        getDepositionPermissions: jest.fn().mockResolvedValue({ permissions: PERMISSIONS_MOCK }),
        fetchCases: jest.fn().mockResolvedValue(getCaseAsc()),
        fetchDeposition: jest.fn().mockRejectedValue(getDepositions()[0]),
        fetchDepositions: jest.fn().mockResolvedValue(getDepositions()),
        createCase: jest.fn().mockResolvedValue(getOneCase()[0]),
        createDepositions: jest.fn().mockResolvedValue(true),
        signUp: jest.fn().mockResolvedValue(getUser1()),
        currentUser: jest.fn().mockResolvedValue(getUser1()),
        verifyUser: jest.fn().mockResolvedValue(true),
        verifyEmail: jest.fn().mockResolvedValue(true),
        addDepoParticipant: jest.fn().mockResolvedValue(true),
        getRecordingInfo: jest.fn().mockResolvedValue(true),
        getEnteredExhibits: jest.fn().mockResolvedValue([]),
    } as any,
});
