import "@testing-library/jest-dom";
import { fireEvent, waitForElement, waitForDomChange } from "@testing-library/react";
import React from "react";
import { ThemeProvider } from "styled-components";
import * as CONSTANTS from "../../constants/exhibits";
import { theme } from "../../constants/styles/theme";
import renderWithGlobalContext from "../utils/renderWithGlobalContext";
import { rootReducer } from "../../state/GlobalState";
import getMockDeps from "../utils/getMockDeps";

import LiveExhibits from "../../routes/InDepo/Exhibits/LiveExhibits";
import { currentExhibit } from "../mocks/currentExhibit";

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"), // use actual for all non-hook parts
    useParams: () => ({
        depositionID: "depositionIDXXXX",
    }),
}));

jest.mock("moment-timezone", () => {
    return jest.fn().mockImplementation(() => ({
        tz: jest.fn((dtz: string) => {
            return {
                format: jest.fn((df) => "06:30 AM"),
            };
        }),
    }));
});

const customDeps = getMockDeps();
describe("Live Exhibits", () => {
    test("Should display the close confirmation modal if the shared exhibit is not isPublic", async () => {
        customDeps.apiService.getEnteredExhibits = jest.fn().mockResolvedValue([]);
        customDeps.apiService.closeExhibit = jest.fn().mockResolvedValue(true);
        const { queryByTestId } = renderWithGlobalContext(
            <ThemeProvider theme={theme}>
                <LiveExhibits />
            </ThemeProvider>,
            customDeps,
            {
                ...rootReducer,
                initialState: {
                    room: {
                        ...rootReducer.initialState.room,
                        isRecording: true,
                        currentExhibitTabName: "liveExhibits",
                        currentExhibit: { ...currentExhibit, close: true },
                    },
                },
            }
        );
        await waitForDomChange();
        expect(queryByTestId("view_document_header")).toBeInTheDocument();
        expect(queryByTestId("close_document_button")).toBeInTheDocument();
        fireEvent.click(queryByTestId("close_document_button"));
        await waitForDomChange();
        expect(queryByTestId("confirm_positive_button")).toBeInTheDocument();
    });
    test("Should not display the close confirmation modal if the shared exhibit is isPublic", async () => {
        customDeps.apiService.getEnteredExhibits = jest.fn().mockResolvedValue([]);
        customDeps.apiService.closeExhibit = jest.fn().mockResolvedValue(true);
        const { queryByText, queryByTestId, debug } = renderWithGlobalContext(
            <ThemeProvider theme={theme}>
                <LiveExhibits />
            </ThemeProvider>,
            customDeps,
            {
                ...rootReducer,
                initialState: {
                    room: {
                        ...rootReducer.initialState.room,
                        isRecording: true,
                        currentExhibitTabName: "liveExhibits",
                        currentExhibit: { ...currentExhibit, close: true, isPublic: true },
                    },
                },
            }
        );
        await waitForDomChange();
        expect(queryByTestId("view_document_header")).toBeInTheDocument();
        expect(queryByTestId("close_document_button")).toBeInTheDocument();
        fireEvent.click(queryByTestId("close_document_button"));
        await waitForDomChange();
        expect(queryByTestId("confirm_positive_button")).not.toBeInTheDocument();
        expect(queryByText(CONSTANTS.LIVE_EXHIBITS_TITLE)).toBeInTheDocument();
    });
    test("Should not call getSignedUrl or getPrivateSignedUrl when the current exhibit has a presignUrl", async () => {
        customDeps.apiService.getEnteredExhibits = jest.fn().mockResolvedValue([]);
        customDeps.apiService.closeExhibit = jest.fn().mockResolvedValue(true);
        customDeps.apiService.getSignedUrl = jest.fn().mockResolvedValue("url");
        customDeps.apiService.getPrivateSignedUrl = jest.fn().mockResolvedValue("url");
        const { queryByText, queryByTestId, debug } = renderWithGlobalContext(
            <ThemeProvider theme={theme}>
                <LiveExhibits />
            </ThemeProvider>,
            customDeps,
            {
                ...rootReducer,
                initialState: {
                    room: {
                        ...rootReducer.initialState.room,
                        isRecording: true,
                        currentExhibitTabName: "liveExhibits",
                        currentExhibit: { ...currentExhibit, close: true, isPublic: true },
                    },
                },
            }
        );
        await waitForDomChange();
        expect(customDeps.apiService.getSignedUrl).not.toHaveBeenCalled();
        expect(customDeps.apiService.getPrivateSignedUrl).not.toHaveBeenCalled();
    });
    test("Should call getSignedUrl and not getPrivateSignedUrl when the current exhibit has not a presignUrl and is read only", async () => {
        customDeps.apiService.getEnteredExhibits = jest.fn().mockResolvedValue([]);
        customDeps.apiService.closeExhibit = jest.fn().mockResolvedValue(true);
        customDeps.apiService.getSignedUrl = jest.fn().mockResolvedValue("url");
        customDeps.apiService.getPrivateSignedUrl = jest.fn().mockResolvedValue("url");
        const { queryByText, queryByTestId, debug } = renderWithGlobalContext(
            <ThemeProvider theme={theme}>
                <LiveExhibits />
            </ThemeProvider>,
            customDeps,
            {
                ...rootReducer,
                initialState: {
                    room: {
                        ...rootReducer.initialState.room,
                        isRecording: true,
                        currentExhibitTabName: "liveExhibits",
                        currentExhibit: { ...currentExhibit, preSignedUrl: "", close: true, isPublic: true },
                    },
                },
            }
        );
        await waitForDomChange();
        expect(customDeps.apiService.getSignedUrl).toHaveBeenCalled();
        expect(customDeps.apiService.getPrivateSignedUrl).not.toHaveBeenCalled();
    });
});
