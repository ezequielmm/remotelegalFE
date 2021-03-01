import "@testing-library/jest-dom";
import { fireEvent, waitForElement } from "@testing-library/react";
import React from "react";
import { ThemeProvider } from "styled-components";
import * as CONSTANTS from "../../constants/exhibits";
import { theme } from "../../constants/styles/theme";
import renderWithGlobalContext from "../utils/renderWithGlobalContext";
import { rootReducer } from "../../state/GlobalState";
import getMockDeps from "../utils/getMockDeps";

import { useSignedUrl, useShareExhibitFile } from "../../hooks/exhibits/hooks";
jest.mock("../../hooks/exhibits/hooks", () => ({
    useSignedUrl: jest.fn(),
    useShareExhibitFile: jest.fn(),
}));
import { useEnteredExhibit } from "../../hooks/useEnteredExhibits";
jest.mock("../../hooks/useEnteredExhibits", () => ({
    useEnteredExhibit: jest.fn(),
}));
import EnteredExhibits from "../../routes/InDepo/Exhibits/EnteredExhibits";
import { enteredExhibits } from "../mocks/enteredExhibits";

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

beforeEach(() => {
    useShareExhibitFile.mockImplementation(() => ({
        sharedExhibit: {},
    }));
    useSignedUrl.mockImplementation(() => ({
        pending: false,
        error: null,
        documentUrl: "",
    }));
    useEnteredExhibit.mockImplementation(() => ({
        getEnteredExhibits: jest.fn(),
        enteredExhibits: [],
        enteredExhibitsPending: false,
    }));
});

describe("Entered Exhibits", () => {
    it("Should be display the Entered exhibits tab with an empty state when has no entered exhibits", () => {
        const handleFetchFiles = jest.fn();
        useEnteredExhibit.mockImplementation(() => ({
            handleFetchFiles,
            enteredExhibits: [],
            enteredExhibitsPending: false,
        }));
        const { queryByText } = renderWithGlobalContext(
            <ThemeProvider theme={theme}>
                <EnteredExhibits />
            </ThemeProvider>,
            getMockDeps(),
            {
                ...rootReducer,
                initialState: {
                    room: {
                        ...rootReducer.initialState.room,
                        isRecording: true,
                        currentExhibitTabName: "enteredExhibits",
                    },
                },
            }
        );
        expect(handleFetchFiles).toBeCalled();
        const enteredExhibitsEmptyStateTitle = queryByText(CONSTANTS.ENTERED_EXHIBITS_EMPTY_STATE_TITLE);
        expect(enteredExhibitsEmptyStateTitle).toBeInTheDocument();
    });
    it("Should be display the Entered exhibits tab with an empty state when has an error", () => {
        const handleFetchFiles = jest.fn();
        useEnteredExhibit.mockImplementation(() => ({
            handleFetchFiles,
            enteredExhibits: [],
            enteredExhibitsPending: false,
            enteredExhibitsError: "error",
        }));
        const { queryByText } = renderWithGlobalContext(
            <ThemeProvider theme={theme}>
                <EnteredExhibits />
            </ThemeProvider>,
            getMockDeps(),
            {
                ...rootReducer,
                initialState: {
                    room: {
                        ...rootReducer.initialState.room,
                        isRecording: true,
                        currentExhibitTabName: "enteredExhibits",
                    },
                },
            }
        );
        expect(handleFetchFiles).toBeCalled();
        const enteredExhibitsEmptyStateTitle = queryByText(CONSTANTS.ENTERED_EXHIBITS_EMPTY_STATE_TITLE);
        expect(enteredExhibitsEmptyStateTitle).toBeInTheDocument();
    });
    it("Should be display the Entered exhibits tab with a list of entered exhibits", () => {
        const handleFetchFiles = jest.fn(() => enteredExhibits);
        useEnteredExhibit.mockImplementation(() => ({
            handleFetchFiles,
            enteredExhibits,
            enteredExhibitsPending: false,
        }));
        const { queryByTestId, queryByText } = renderWithGlobalContext(
            <ThemeProvider theme={theme}>
                <EnteredExhibits />
            </ThemeProvider>,
            getMockDeps(),
            {
                ...rootReducer,
                initialState: {
                    room: {
                        ...rootReducer.initialState.room,
                        isRecording: true,
                        currentExhibitTabName: "enteredExhibits",
                    },
                },
            }
        );
        expect(handleFetchFiles).toBeCalled();
        expect(handleFetchFiles).toHaveReturnedWith(enteredExhibits);
        const enteredExhibitsEmptyStateTitle = queryByText(CONSTANTS.ENTERED_EXHIBITS_EMPTY_STATE_TITLE);
        expect(enteredExhibitsEmptyStateTitle).not.toBeInTheDocument();
        const enteredExhibitsTable = queryByTestId("entered_exhibits_table");
        expect(enteredExhibitsTable).toBeInTheDocument();
        const enteredExhibitDisplayName = queryByTestId("entered_exhibit_display_name");
        expect(enteredExhibitDisplayName).toBeInTheDocument();
    });
    it("should be display the exhibit viewer after click on the view button", async () => {
        const handleFetchFiles = jest.fn(() => enteredExhibits);
        useEnteredExhibit.mockImplementation(() => ({
            handleFetchFiles,
            enteredExhibits,
            enteredExhibitsPending: false,
        }));
        const { queryByTestId, queryByText, debug } = renderWithGlobalContext(
            <ThemeProvider theme={theme}>
                <EnteredExhibits />
            </ThemeProvider>,
            getMockDeps(),
            {
                ...rootReducer,
                initialState: {
                    room: {
                        ...rootReducer.initialState.room,
                        isRecording: true,
                        currentExhibitTabName: "enteredExhibits",
                    },
                },
            }
        );
        expect(queryByTestId("entered_exhibits_table")).toBeInTheDocument();
        expect(queryByTestId("view_document_header")).not.toBeInTheDocument();
        fireEvent.click(queryByTestId("file_list_view_button"));
        expect(await waitForElement(() => queryByTestId("view_document_header"))).toBeInTheDocument();
    });
});
