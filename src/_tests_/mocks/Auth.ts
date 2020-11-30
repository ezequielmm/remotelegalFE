/* eslint-disable import/prefer-default-export */
import { Auth } from "aws-amplify";
import { ITokenSet } from "../../models/general";

export const NOT_VALID = () => {
    Auth.currentAuthenticatedUser = jest.fn().mockImplementation(() => {
        return new Promise((_, reject) => {
            reject(Error("Not Authenticated"));
        });
    });

    Auth.currentSession = jest.fn().mockImplementation(() => {
        return new Promise((_, reject) => {
            reject(Error("Not Authenticated"));
        });
    });
};

export const VALID = () => {
    Auth.currentAuthenticatedUser = jest.fn().mockImplementation(() => {
        return new Promise((resolve) => {
            resolve("This was successfull!");
        });
    });
    Auth.currentSession = jest.fn().mockImplementation(() => {
        return new Promise((resolve) => {
            resolve({ getIdToken: () => ({ getJwtToken: () => "test1" }) });
        });
    });
};

export const TOKEN_SET = {
    accessToken: "access",
    refreshToken: "refresh",
    accessTokenExpiryTime: 1234,
} as ITokenSet;

export const VALID_WITH_REFRESH = () => {
    Auth.currentAuthenticatedUser = jest.fn().mockImplementation(() => {
        return new Promise((resolve) => {
            resolve("This was successfull!");
        });
    });
    Auth.currentSession = jest.fn().mockResolvedValue({
        getIdToken: () => ({
            getJwtToken: () => TOKEN_SET.accessToken,
            getExpiration: () => TOKEN_SET.accessTokenExpiryTime,
        }),
        getRefreshToken: () => ({
            getToken: () => TOKEN_SET.refreshToken,
        }),
    });
};
