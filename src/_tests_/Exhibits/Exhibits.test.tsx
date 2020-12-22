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
import { useUploadFile, useFileList } from "../../hooks/exhibits/hooks";
jest.mock("../../hooks/exhibits/hooks", () => ({
    useUploadFile: jest.fn(),
    useFileList: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"), // use actual for all non-hook parts
    useParams: () => ({
        depositionID: "depositionIDXXXX",
    }),
}));

beforeEach(() => {
    useUploadFile.mockImplementation(() => ({
        upload: jest.fn(),
    }));
    useFileList.mockImplementation(() => ({
        handleFetchFiles: jest.fn(),
        loading: false,
        errorFetchFiles: false,
        files: [],
        refreshList: jest.fn(),
    }));
});

describe("Exhibits", () => {
    it.each(CONSTANTS.EXHIBIT_TABS_DATA.map((tab) => [tab.title, tab]))(
        "should have %s tab active only if it's the default tab",
        async (title, { tabId, tabTestId }: ExhibitTabData) => {
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
        }));
        const { queryByTestId } = renderWithGlobalContext(
            <ThemeProvider theme={theme}>
                <MyExhibits />
            </ThemeProvider>
        );
        const progressBar = queryByTestId("progress-bar");
        expect(progressBar).not.toBeInTheDocument();
    });
    it("should display the file list when has more than one file in the list", async () => {
        useFileList.mockImplementation(() => ({
            files: [{ name: "fileName" }],
        }));
        const { queryByTestId } = renderWithGlobalContext(
            <ThemeProvider theme={theme}>
                <MyExhibits />
            </ThemeProvider>
        );
        const fileListTable = queryByTestId("file-list-table");
        expect(fileListTable).toBeInTheDocument();
    });
    it("should not display the file list when has zero file in the list", async () => {
        useFileList.mockImplementation(() => ({
            files: [],
        }));
        const { queryByTestId } = renderWithGlobalContext(
            <ThemeProvider theme={theme}>
                <MyExhibits />
            </ThemeProvider>
        );
        const fileListTable = queryByTestId("file-list-table");
        expect(fileListTable).not.toBeInTheDocument();
    });
    it("should not display the empty state component when has more than file in the list", async () => {
        useFileList.mockImplementation(() => ({
            files: [{ name: "fileName" }],
        }));
        const { queryByTestId, queryByText } = renderWithGlobalContext(
            <ThemeProvider theme={theme}>
                <MyExhibits />
            </ThemeProvider>
        );
        const fileListTable = queryByTestId("file-list-table");
        const noExhibitComponent = queryByText("No exhibits added yet");
        expect(fileListTable).toBeInTheDocument();
        expect(noExhibitComponent).not.toBeInTheDocument();
    });
    it("should not display the empty state component when has zero file in the list", async () => {
        useFileList.mockImplementation(() => ({
            files: [],
        }));
        const { queryByTestId, queryByText } = renderWithGlobalContext(
            <ThemeProvider theme={theme}>
                <MyExhibits />
            </ThemeProvider>
        );
        const fileListTable = queryByTestId("file-list-table");
        const noExhibitComponent = queryByText("No exhibits added yet");
        expect(fileListTable).not.toBeInTheDocument();
        expect(noExhibitComponent).toBeInTheDocument();
    });
});
