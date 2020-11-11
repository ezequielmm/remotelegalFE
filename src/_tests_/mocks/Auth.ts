/* eslint-disable import/prefer-default-export */
import { Auth } from "aws-amplify";

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
