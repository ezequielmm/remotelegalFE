import "@testing-library/jest-dom";
import { fireEvent, waitForDomChange } from "@testing-library/react";
import React from "react";
import { ThemeProvider } from "styled-components";
import * as CONSTANTS from "../../constants/exhibits";
import { theme } from "../../constants/styles/theme";
import renderWithGlobalContext from "../utils/renderWithGlobalContext";
import { rootReducer } from "../../state/GlobalState";
import getMockDeps from "../utils/getMockDeps";

import MyExhibits from "../../routes/InDepo/Exhibits/MyExhibits";
import { exhibits } from "../mocks/exhibits";
import { currentExhibit } from "../mocks/currentExhibit";
import { wait } from "../../helpers/wait";

let customDeps;
beforeEach(() => {
    customDeps = getMockDeps();
});

test("when click on the delete exhibit button, in the file list options menu, should be display a confirmation modal component", async () => {
    customDeps.apiService.fetchDepositionsFiles = jest.fn().mockResolvedValue(exhibits);
    customDeps.apiService.deleteExhibit = jest.fn().mockResolvedValue(true);
    const { queryByTestId, queryByText } = renderWithGlobalContext(
        <ThemeProvider theme={theme}>
            <MyExhibits />
        </ThemeProvider>,
        customDeps,
        {
            ...rootReducer,
            initialState: {
                room: {
                    ...rootReducer.initialState.room,
                    isRecording: true,
                    currentExhibitTabName: "myExhibits",
                },
            },
        }
    );
    await waitForDomChange();
    expect(queryByTestId("file_list_table")).toBeInTheDocument();
    fireEvent.click(queryByTestId("dropdown_options").children[0].firstChild);
    expect(queryByTestId("menu_options")).toBeInTheDocument();
    expect(queryByTestId("option_delete_button")).toBeInTheDocument();
    fireEvent.click(queryByTestId("option_delete_button"));
    expect(queryByText(CONSTANTS.MY_EXHIBITS_DELETE_TITLE_TEXT)).toBeInTheDocument();
});
test("when click on the delete exhibit button, on the delete confirmation modal, should be close a confirmation modal component and refresh the file list", async () => {
    customDeps.apiService.fetchDepositionsFiles = jest.fn().mockResolvedValue(exhibits);
    customDeps.apiService.deleteExhibit = jest.fn().mockResolvedValue(true);
    const { queryByTestId, queryByText } = renderWithGlobalContext(
        <ThemeProvider theme={theme}>
            <MyExhibits />
        </ThemeProvider>,
        customDeps,
        {
            ...rootReducer,
            initialState: {
                room: {
                    ...rootReducer.initialState.room,
                    isRecording: true,
                    currentExhibitTabName: "myExhibits",
                },
            },
        }
    );
    await waitForDomChange();
    fireEvent.click(queryByTestId("dropdown_options").children[0].firstChild);
    fireEvent.click(queryByTestId("option_delete_button"));
    fireEvent.click(queryByText(CONSTANTS.MY_EXHIBITS_DELETE_OK_BUTTON_TEXT));
    await wait(1000);
    expect(queryByText(CONSTANTS.MY_EXHIBITS_DELETE_OK_BUTTON_TEXT)).not.toBeInTheDocument();
    expect(customDeps.apiService.fetchDepositionsFiles).toHaveBeenCalled();
});
test("when delete an exhibit get an error a message should be display", async () => {
    customDeps.apiService.fetchDepositionsFiles = jest.fn().mockResolvedValue(exhibits);
    customDeps.apiService.deleteExhibit = jest.fn().mockRejectedValue(async () => {
        throw Error("Something wrong");
    });
    const { queryByTestId, queryByText } = renderWithGlobalContext(
        <ThemeProvider theme={theme}>
            <MyExhibits />
        </ThemeProvider>,
        customDeps,
        {
            ...rootReducer,
            initialState: {
                room: {
                    ...rootReducer.initialState.room,
                    isRecording: true,
                    currentExhibitTabName: "myExhibits",
                },
            },
        }
    );
    await waitForDomChange();
    fireEvent.click(queryByTestId("dropdown_options").children[0].firstChild);
    fireEvent.click(queryByTestId("option_delete_button"));
    fireEvent.click(queryByText(CONSTANTS.MY_EXHIBITS_DELETE_OK_BUTTON_TEXT));
    await wait(1000);
    expect(queryByText(CONSTANTS.EXHIBIT_DELETE_ERROR_MESSAGE)).toBeInTheDocument();
});
test("should disable delete exhibit button when it is a current shared exhibit", async () => {
    customDeps.apiService.fetchDepositionsFiles = jest.fn().mockResolvedValue([currentExhibit]);
    customDeps.apiService.deleteExhibit = jest.fn().mockRejectedValue(async () => {
        throw Error("Something wrong");
    });
    const { queryByTestId } = renderWithGlobalContext(
        <ThemeProvider theme={theme}>
            <MyExhibits />
        </ThemeProvider>,
        customDeps,
        {
            ...rootReducer,
            initialState: {
                room: {
                    ...rootReducer.initialState.room,
                    isRecording: true,
                    currentExhibitTabName: "myExhibits",
                    currentExhibit: currentExhibit,
                },
            },
        }
    );
    await waitForDomChange();
    fireEvent.click(queryByTestId("dropdown_options").children[0].firstChild);
    expect(queryByTestId("option_delete_button")).toBeDisabled();
});
