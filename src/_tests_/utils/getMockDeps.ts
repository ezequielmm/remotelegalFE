/* eslint-disable import/prefer-default-export */
import { Deps } from "../../models/general";
import { getCaseAsc, getOneCase } from "../constants/cases";
import { getUser_1 } from "../constants/signUp";

export default (): Deps => ({
    apiService: {
        fetchCases: jest.fn().mockResolvedValue(getCaseAsc()),
        createCase: jest.fn().mockResolvedValue(getOneCase()[0]),
        verifyUser: jest.fn().mockResolvedValue(true),
        signUp: jest.fn().mockResolvedValue(getUser_1()),
        verifyEmail: jest.fn().mockResolvedValue(true),
    } as any,
});
