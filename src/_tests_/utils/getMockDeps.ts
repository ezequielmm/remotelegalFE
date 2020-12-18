/* eslint-disable import/prefer-default-export */
import { Deps } from "../../models/general";
import { getCaseAsc, getOneCase } from "../constants/cases";
import { JOIN_DEPOSITION_MOCK } from "../constants/InDepo";
import { getDepositions1 } from "../constants/depositions";
import { getUser1 } from "../constants/signUp";

export default (): Deps => ({
    apiService: {
        recordDeposition: jest.fn().mockResolvedValue({}),
        joinDeposition: jest.fn().mockResolvedValue(JOIN_DEPOSITION_MOCK),
        fetchCases: jest.fn().mockResolvedValue(getCaseAsc()),
        fetchDepositions: jest.fn().mockResolvedValue(getDepositions1()),
        createCase: jest.fn().mockResolvedValue(getOneCase()[0]),
        createDepositions: jest.fn().mockResolvedValue(true),
        signUp: jest.fn().mockResolvedValue(getUser1()),
        verifyUser: jest.fn().mockResolvedValue(true),
        verifyEmail: jest.fn().mockResolvedValue(true),
    } as any,
});
