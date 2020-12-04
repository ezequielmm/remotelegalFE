/* eslint-disable import/prefer-default-export */
import { Deps } from "../../models/general";
import { getCaseAsc, getOneCase } from "../constants/cases";
import { JOIN_DEPOSITION_MOCK } from "../constants/InDepo";
import { getUser_1 } from "../constants/signUp";

export default (): Deps => ({
    apiService: {
        joinDeposition: jest.fn().mockResolvedValue(JOIN_DEPOSITION_MOCK),
        fetchCases: jest.fn().mockResolvedValue(getCaseAsc()),
        createCase: jest.fn().mockResolvedValue(getOneCase()[0]),
        verifyUser: jest.fn().mockResolvedValue(true),
        signUp: jest.fn().mockResolvedValue(getUser_1()),
        verifyEmail: jest.fn().mockResolvedValue(true),
    } as any,
});
