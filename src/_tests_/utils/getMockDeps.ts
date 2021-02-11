/* eslint-disable import/prefer-default-export */
import { Deps } from "../../models/general";
import { getCaseAsc, getOneCase } from "../constants/cases";
import { JOIN_BREAKROOM_MOCK, JOIN_DEPOSITION_MOCK, PERMISSIONS_MOCK } from "../constants/InDepo";
import { getDepositions } from "../constants/depositions";
import { getUser1 } from "../constants/signUp";
import { getEvents, getRecordResponse, getTranscription } from "../mocks/transcription";

export default (): Deps => ({
    apiService: {
        recordDeposition: jest.fn().mockResolvedValue(getRecordResponse(true)),
        joinDeposition: jest.fn().mockResolvedValue(JOIN_DEPOSITION_MOCK),
        joinBreakroom: jest.fn().mockResolvedValue(JOIN_BREAKROOM_MOCK),
        getDepositionTranscriptions: jest.fn().mockResolvedValue([getTranscription()]),
        getDepositionEvents: jest.fn().mockResolvedValue(getEvents()),
        getDepositionPermissions: jest.fn().mockResolvedValue({ permissions: PERMISSIONS_MOCK }),
        fetchCases: jest.fn().mockResolvedValue(getCaseAsc()),
        fetchDeposition: jest.fn().mockResolvedValue(getDepositions()[0]),
        fetchDepositions: jest.fn().mockResolvedValue(getDepositions()),
        createCase: jest.fn().mockResolvedValue(getOneCase()[0]),
        createDepositions: jest.fn().mockResolvedValue(true),
        signUp: jest.fn().mockResolvedValue(getUser1()),
        currentUser: jest.fn().mockResolvedValue(getUser1()),
        verifyUser: jest.fn().mockResolvedValue(true),
        verifyEmail: jest.fn().mockResolvedValue(true),
        addDepoParticipant: jest.fn().mockResolvedValue(true),
    } as any,
});
