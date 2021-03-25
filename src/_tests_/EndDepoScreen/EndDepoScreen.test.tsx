import React from "react";
import EndDepoScreen from "../../routes/PostDepo/EndDepoScreen/EndDepoScreen";
import * as CONSTANTS from "../constants/postDepo";
import renderWithGlobalContext from "../utils/renderWithGlobalContext";
import { useEndDepoCurrentUser, useEndDepoDownloadAssets } from "../../hooks/endDepo/hooks";

jest.mock("../../hooks/endDepo/hooks", () => ({
    useEndDepoCurrentUser: jest.fn(),
    useEndDepoDownloadAssets: jest.fn(),
}));

describe("EndDepoScreen", () => {
    test("End Depo Screen is shown a spinner when user info is not loaded", async () => {
        useEndDepoCurrentUser.mockImplementation(() => ({
            userInfo: null,
            loadingUserInfo: true,
        }));
        useEndDepoDownloadAssets.mockImplementation(() => ({
            downloadAssets: jest.fn(),
        }));
        const { queryByText, queryByTestId } = renderWithGlobalContext(<EndDepoScreen />);
        expect(queryByTestId("spinner")).toBeInTheDocument();
        expect(queryByText(CONSTANTS.END_DEPO_SCREEN_FIRST_TEXT)).not.toBeInTheDocument();
        expect(queryByText(CONSTANTS.END_DEPO_SCREEN_SECOND_TEXT)).not.toBeInTheDocument();
        expect(queryByTestId("download_assets_button")).not.toBeInTheDocument();
    });
    test("End Depo Screen is shown with proper text when all the user info is loaded", async () => {
        useEndDepoCurrentUser.mockImplementation(() => ({
            userInfo: {
                emailAddress: "test@test.com",
                firstName: "Joe",
                lastName: "Doe",
            },
            loadingUserInfo: false,
        }));
        useEndDepoDownloadAssets.mockImplementation(() => ({
            downloadAssets: jest.fn(),
        }));
        const { getByText, queryByTestId } = renderWithGlobalContext(<EndDepoScreen />);
        expect(queryByTestId("spinner")).not.toBeInTheDocument();
        expect(getByText(CONSTANTS.END_DEPO_SCREEN_FIRST_TEXT)).toBeInTheDocument();
        expect(getByText(CONSTANTS.END_DEPO_SCREEN_SECOND_TEXT)).toBeInTheDocument();
        expect(queryByTestId("download_assets_button")).toBeInTheDocument();
    });
    test("End Depo Screen user display name should be display well formatted", async () => {
        useEndDepoCurrentUser.mockImplementation(() => ({
            userInfo: {
                emailAddress: "test@test.com",
                firstName: "Joe",
                lastName: "Doe",
            },
            loadingUserInfo: false,
        }));
        useEndDepoDownloadAssets.mockImplementation(() => ({
            downloadAssets: jest.fn(),
        }));
        const { queryByText } = renderWithGlobalContext(<EndDepoScreen />);
        expect(queryByText("Joe Doe,")).toBeInTheDocument();
    });
    test("Should show endDepo screen for witness", async () => {
        const { getByText } = renderWithGlobalContext(<EndDepoScreen location={{ state: { isWitness: true } }} />);
        expect(getByText(CONSTANTS.END_DEPO_SCREEN_TEXT_FOR_WITNESS)).toBeInTheDocument();
    });
});
