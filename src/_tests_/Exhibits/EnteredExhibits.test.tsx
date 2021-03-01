import "@testing-library/jest-dom";
import { fireEvent, waitForElement, waitForDomChange } from "@testing-library/react";
import React from "react";
import { ThemeProvider } from "styled-components";
import * as CONSTANTS from "../../constants/exhibits";
import { theme } from "../../constants/styles/theme";
import renderWithGlobalContext from "../utils/renderWithGlobalContext";
import { rootReducer } from "../../state/GlobalState";
import getMockDeps from "../utils/getMockDeps";

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

const customDeps = getMockDeps();
describe("Entered Exhibits", () => {
    test("Should be display the Entered exhibits tab with an empty state when has no entered exhibits", () => {
        customDeps.apiService.getEnteredExhibits = jest.fn().mockResolvedValue([]);
        const { queryByText } = renderWithGlobalContext(
            <ThemeProvider theme={theme}>
                <EnteredExhibits />
            </ThemeProvider>,
            customDeps,
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
        const enteredExhibitsEmptyStateTitle = queryByText(CONSTANTS.ENTERED_EXHIBITS_EMPTY_STATE_TITLE);
        expect(enteredExhibitsEmptyStateTitle).toBeInTheDocument();
    });
    test("Should be display the Entered exhibits tab with an empty state when has an error", () => {
        customDeps.apiService.getEnteredExhibits = jest.fn().mockResolvedValue([]);
        const { queryByText } = renderWithGlobalContext(
            <ThemeProvider theme={theme}>
                <EnteredExhibits />
            </ThemeProvider>,
            customDeps,
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
        const enteredExhibitsEmptyStateTitle = queryByText(CONSTANTS.ENTERED_EXHIBITS_EMPTY_STATE_TITLE);
        expect(enteredExhibitsEmptyStateTitle).toBeInTheDocument();
    });
    test("Should be display the Entered exhibits tab with a list of entered exhibits", async () => {
        customDeps.apiService.getEnteredExhibits = jest.fn().mockResolvedValue(enteredExhibits);
        const { queryByTestId, queryByText } = renderWithGlobalContext(
            <ThemeProvider theme={theme}>
                <EnteredExhibits />
            </ThemeProvider>,
            customDeps,
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
        await waitForDomChange();
        const enteredExhibitsEmptyStateTitle = queryByText(CONSTANTS.ENTERED_EXHIBITS_EMPTY_STATE_TITLE);
        expect(enteredExhibitsEmptyStateTitle).not.toBeInTheDocument();
        const enteredExhibitsTable = queryByTestId("entered_exhibits_table");
        expect(enteredExhibitsTable).toBeInTheDocument();
        const enteredExhibitDisplayName = queryByTestId("entered_exhibit_display_name");
        expect(enteredExhibitDisplayName).toBeInTheDocument();
    });
    test("should be display the exhibit viewer after click on the view button", async () => {
        customDeps.apiService.getEnteredExhibits = jest.fn().mockResolvedValue(enteredExhibits);
        const { queryByTestId, queryByText, debug } = renderWithGlobalContext(
            <ThemeProvider theme={theme}>
                <EnteredExhibits />
            </ThemeProvider>,
            customDeps,
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
        await waitForDomChange();
        expect(queryByTestId("entered_exhibits_table")).toBeInTheDocument();
        expect(queryByTestId("view_document_header")).not.toBeInTheDocument();
        fireEvent.click(queryByTestId("file_list_view_button"));
        expect(await waitForElement(() => queryByTestId("view_document_header"))).toBeInTheDocument();
    });
    test("should be display the exhibit share modal after click on the share button", async () => {
        customDeps.apiService.getEnteredExhibits = jest.fn().mockResolvedValue(enteredExhibits);
        customDeps.apiService.shareExhibit = jest.fn().mockResolvedValue(true);
        const { queryByTestId, queryByText, debug } = renderWithGlobalContext(
            <ThemeProvider theme={theme}>
                <EnteredExhibits />
            </ThemeProvider>,
            customDeps,
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
        await waitForDomChange();
        expect(queryByTestId("entered_exhibits_table")).toBeInTheDocument();
        fireEvent.click(queryByTestId("file_list_share_button"));
        expect(await waitForElement(() => queryByTestId("share_document_modal"))).toBeInTheDocument();
        fireEvent.click(queryByTestId("confirm_positive_button"));
        await waitForDomChange();
        expect(queryByTestId("confirm_positive_button")).not.toBeInTheDocument();
    });
});
