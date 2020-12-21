import "@testing-library/jest-dom";
import { act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { ThemeProvider } from "styled-components";
import * as CONSTANTS from "../../constants/exhibits";
import { theme } from "../../constants/styles/theme";
import Exhibits from "../../routes/InDepo/Exhibits";
import { ExhibitTabData } from "../../routes/InDepo/Exhibits/ExhibitTabs/ExhibitTabs";
import MyExhibits from "../../routes/InDepo/Exhibits/MyExhibits";
import renderWithGlobalContext from "../utils/renderWithGlobalContext";
import { useUploadFile } from "../../hooks/exhibits/hooks";
jest.mock("../../hooks/exhibits/hooks", () => ({
    useUploadFile: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"), // use actual for all non-hook parts
    useParams: () => ({
        depositionID: "depositionIDXXXX",
    }),
}));

describe("Exhibits", () => {
    it.each(CONSTANTS.EXHIBIT_TABS_DATA.map((tab) => [tab.title, tab]))(
        "should have %s tab active only if it's the default tab",
        async (title, { tabId, tabTestId }: ExhibitTabData) => {
            useUploadFile.mockImplementation(() => ({
                upload: jest.fn(),
                progress: 0,
                error: false,
                status: "initial",
            }));
            const { queryByTestId } = renderWithGlobalContext(
                <ThemeProvider theme={theme}>
                    <Exhibits onClick={() => {}} visible />
                </ThemeProvider>
            );
            const activeTab = queryByTestId(`${tabTestId}_active`);
            if (tabId === CONSTANTS.DEFAULT_ACTIVE_TAB) {
                expect(activeTab).toBeTruthy();
            } else {
                expect(activeTab).toBeFalsy();
            }
        }
    );

    it.each(CONSTANTS.EXHIBIT_TABS_DATA.map((tab) => [tab.title, tab]))(
        "should have %s tab with active color when click on it",
        async (title, { tabTestId }: ExhibitTabData) => {
            useUploadFile.mockImplementation(() => ({
                upload: jest.fn(),
                progress: 0,
                error: false,
                status: "initial",
            }));
            const { getByTestId } = renderWithGlobalContext(
                <ThemeProvider theme={theme}>
                    <Exhibits onClick={() => {}} visible />
                </ThemeProvider>
            );
            const tab = getByTestId(tabTestId);
            await act(async () => userEvent.click(tab));
            const activeTab = getByTestId(`${tabTestId}_active`);
            expect(activeTab).toBeTruthy();
        }
    );

    it.each(CONSTANTS.EXHIBIT_TABS_DATA.map((tab) => [tab.title, tab]))(
        "should open %s tTabPane when click on its Tab",
        async (title, { tabTestId, tabPaneTestId }: ExhibitTabData) => {
            useUploadFile.mockImplementation(() => ({
                upload: jest.fn(),
                progress: 0,
                error: false,
                status: "initial",
            }));
            const { getByTestId } = renderWithGlobalContext(
                <ThemeProvider theme={theme}>
                    <Exhibits onClick={() => {}} visible />
                </ThemeProvider>
            );
            const tab = getByTestId(tabTestId);
            await act(async () => userEvent.click(tab));
            const tabPane = getByTestId(tabPaneTestId);
            expect(tabPane).toBeTruthy();
        }
    );

    it("The progress bar should be not displayed by default", async () => {
        useUploadFile.mockImplementation(() => ({
            upload: jest.fn(),
            progress: 0,
            error: false,
            status: "initial",
        }));
        const { queryByTestId } = renderWithGlobalContext(
            <ThemeProvider theme={theme}>
                <MyExhibits />
            </ThemeProvider>
        );
        const progressBar = queryByTestId("progress-bar");
        expect(progressBar).not.toBeInTheDocument();
    });
});
