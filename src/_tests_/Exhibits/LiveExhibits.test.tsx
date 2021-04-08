import "@testing-library/jest-dom";
import { fireEvent, waitForDomChange, act } from "@testing-library/react";
import React from "react";
import { ThemeProvider } from "styled-components";
import * as CONSTANTS from "../../constants/exhibits";
import { theme } from "../../constants/styles/theme";
import renderWithGlobalContext from "../utils/renderWithGlobalContext";
import { rootReducer } from "../../state/GlobalState";
import getMockDeps from "../utils/getMockDeps";

import LiveExhibits from "../../routes/InDepo/Exhibits/LiveExhibits";
import { currentExhibit } from "../mocks/currentExhibit";
import { userMock } from "../mocks/user";

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

test("Should display the close confirmation modal if the shared exhibit is not isPublic", async () => {
    customDeps.apiService.getEnteredExhibits = jest.fn().mockResolvedValue([]);
    customDeps.apiService.closeExhibit = jest.fn().mockResolvedValue(true);
    customDeps.apiService.sendAnnotation = jest.fn().mockResolvedValue(true);
    const { queryByTestId } = renderWithGlobalContext(
        <ThemeProvider theme={theme}>
            <LiveExhibits />
        </ThemeProvider>,
        customDeps,
        {
            ...rootReducer,
            initialState: {
                signalR: {
                    signalR: null,
                },
                room: {
                    ...rootReducer.initialState.room,
                    isRecording: true,
                    currentExhibitTabName: "liveExhibits",
                    currentExhibit: { ...currentExhibit, close: true, isPublic: false },
                },
            },
        }
    );
    expect(queryByTestId("view_document_header")).toBeInTheDocument();
    expect(queryByTestId("close_document_button")).toBeInTheDocument();
    act(() => {
        fireEvent.click(queryByTestId("close_document_button"));
    });
    expect(queryByTestId("confirm_positive_button")).toBeInTheDocument();
});

test("Should not display the close confirmation modal if the shared exhibit is isPublic", async () => {
    customDeps.apiService.getEnteredExhibits = jest.fn().mockResolvedValue([]);
    customDeps.apiService.closeExhibit = jest.fn().mockResolvedValue(true);
    customDeps.apiService.sendAnnotation = jest.fn().mockResolvedValue(true);

    const { queryByText, queryByTestId } = renderWithGlobalContext(
        <ThemeProvider theme={theme}>
            <LiveExhibits />
        </ThemeProvider>,
        customDeps,
        {
            ...rootReducer,
            initialState: {
                signalR: {
                    signalR: null,
                },
                room: {
                    ...rootReducer.initialState.room,
                    isRecording: true,
                    currentExhibitTabName: "liveExhibits",
                    currentExhibit: { ...currentExhibit, close: true, isPublic: true },
                },
            },
        }
    );
    act(() => {
        fireEvent.click(queryByTestId("close_document_button"));
    });
    expect(queryByTestId("confirm_positive_button")).not.toBeInTheDocument();
    await waitForDomChange();
    expect(queryByText(CONSTANTS.LIVE_EXHIBITS_TITLE)).toBeInTheDocument();
});

test("Should not call getSignedUrl or getPrivateSignedUrl when the current exhibit has a presignUrl", async () => {
    customDeps.apiService.getEnteredExhibits = jest.fn().mockResolvedValue([]);
    customDeps.apiService.closeExhibit = jest.fn().mockResolvedValue(true);
    customDeps.apiService.sendAnnotation = jest.fn().mockResolvedValue(true);
    customDeps.apiService.getSignedUrl = jest.fn().mockResolvedValue(true);
    customDeps.apiService.getPrivateSignedUrl = jest.fn().mockResolvedValue(true);
    renderWithGlobalContext(
        <ThemeProvider theme={theme}>
            <LiveExhibits />
        </ThemeProvider>,
        customDeps,
        {
            ...rootReducer,
            initialState: {
                signalR: {
                    signalR: null,
                },
                room: {
                    ...rootReducer.initialState.room,
                    isRecording: true,
                    currentExhibitTabName: "liveExhibits",
                    currentExhibit: { ...currentExhibit, close: true, isPublic: true },
                },
            },
        }
    );
    expect(customDeps.apiService.getSignedUrl).not.toHaveBeenCalled();
    expect(customDeps.apiService.getPrivateSignedUrl).not.toHaveBeenCalled();
});

test("Should call getSignedUrl and not getPrivateSignedUrl when the current exhibit has not a presignUrl and is read only", async () => {
    customDeps.apiService.getEnteredExhibits = jest.fn().mockResolvedValue([]);
    customDeps.apiService.closeExhibit = jest.fn().mockResolvedValue(true);
    customDeps.apiService.getSignedUrl = jest.fn().mockResolvedValue("url");
    customDeps.apiService.getPrivateSignedUrl = jest.fn().mockResolvedValue("url");
    renderWithGlobalContext(
        <ThemeProvider theme={theme}>
            <LiveExhibits />
        </ThemeProvider>,
        customDeps,
        {
            ...rootReducer,
            initialState: {
                signalR: {
                    signalR: null,
                },
                room: {
                    ...rootReducer.initialState.room,
                    isRecording: true,
                    currentExhibitTabName: "liveExhibits",
                    currentExhibit: { ...currentExhibit, preSignedUrl: "", close: true, isPublic: true },
                },
            },
        }
    );
    expect(customDeps.apiService.getSignedUrl).toHaveBeenCalled();
    expect(customDeps.apiService.getPrivateSignedUrl).not.toHaveBeenCalled();
});

test("Should call getPrivateSignedUrl and not getSignedUrl when the current exhibit has not a presignUrl and is not read only", async () => {
    customDeps.apiService.getEnteredExhibits = jest.fn().mockResolvedValue([]);
    customDeps.apiService.closeExhibit = jest.fn().mockResolvedValue(true);
    customDeps.apiService.getSignedUrl = jest.fn().mockResolvedValue("url");
    customDeps.apiService.getPrivateSignedUrl = jest.fn().mockResolvedValue("url");
    renderWithGlobalContext(
        <ThemeProvider theme={theme}>
            <LiveExhibits />
        </ThemeProvider>,
        customDeps,
        {
            ...rootReducer,
            initialState: {
                signalR: {
                    signalR: null,
                },
                room: {
                    ...rootReducer.initialState.room,
                    isRecording: true,
                    currentExhibitTabName: "liveExhibits",
                    currentExhibit: { ...currentExhibit, preSignedUrl: "", close: true, isPublic: false },
                },
            },
        }
    );
    expect(customDeps.apiService.getPrivateSignedUrl).toHaveBeenCalled();
});

test("should display the close shared exhibit button when has the allowed permissions", async () => {
    customDeps.apiService.getEnteredExhibits = jest.fn().mockResolvedValue([]);
    customDeps.apiService.closeExhibit = jest.fn().mockResolvedValue(true);
    customDeps.apiService.getSignedUrl = jest.fn().mockResolvedValue("url");
    customDeps.apiService.getPrivateSignedUrl = jest.fn().mockResolvedValue("url");
    const { queryByTestId } = renderWithGlobalContext(
        <ThemeProvider theme={theme}>
            <LiveExhibits />
        </ThemeProvider>,
        customDeps,
        {
            ...rootReducer,
            initialState: {
                signalR: {
                    signalR: null,
                },
                room: {
                    ...rootReducer.initialState.room,
                    isRecording: true,
                    currentExhibitTabName: "liveExhibits",
                    currentExhibit: { ...currentExhibit, preSignedUrl: "", close: true, isPublic: false },
                    stampLabel: "",
                },
            },
        }
    );
    const closeButton = queryByTestId("close_document_button");
    expect(closeButton).toBeInTheDocument();
});

test("should not display the close shared exhibit button when has not the allowed permissions", async () => {
    customDeps.apiService.getEnteredExhibits = jest.fn().mockResolvedValue([]);
    customDeps.apiService.closeExhibit = jest.fn().mockResolvedValue(true);
    customDeps.apiService.getSignedUrl = jest.fn().mockResolvedValue("url");
    customDeps.apiService.getPrivateSignedUrl = jest.fn().mockResolvedValue("url");
    const { queryByTestId } = renderWithGlobalContext(
        <ThemeProvider theme={theme}>
            <LiveExhibits />
        </ThemeProvider>,
        customDeps,
        {
            ...rootReducer,
            initialState: {
                signalR: {
                    signalR: null,
                },
                room: {
                    ...rootReducer.initialState.room,
                    isRecording: true,
                    currentExhibitTabName: "liveExhibits",
                    currentExhibit: { ...currentExhibit, preSignedUrl: "", close: false, isPublic: false },
                    stampLabel: "",
                },
            },
        }
    );
    const closeButton = queryByTestId("close_document_button");
    expect(closeButton).not.toBeInTheDocument();
});

test("should display the close shared exhibit modal when after click the button", async () => {
    customDeps.apiService.getEnteredExhibits = jest.fn().mockResolvedValue([]);
    customDeps.apiService.closeExhibit = jest.fn().mockResolvedValue(true);
    customDeps.apiService.getSignedUrl = jest.fn().mockResolvedValue("url");
    customDeps.apiService.getPrivateSignedUrl = jest.fn().mockResolvedValue("url");
    const { queryByTestId } = renderWithGlobalContext(
        <ThemeProvider theme={theme}>
            <LiveExhibits />
        </ThemeProvider>,
        customDeps,
        {
            ...rootReducer,
            initialState: {
                signalR: {
                    signalR: null,
                },
                room: {
                    ...rootReducer.initialState.room,
                    isRecording: true,
                    currentExhibitTabName: "liveExhibits",
                    currentExhibit: { ...currentExhibit, preSignedUrl: "", close: true, isPublic: false },
                    stampLabel: "",
                },
            },
        }
    );
    const closeButton = queryByTestId("close_document_button");
    fireEvent.click(closeButton);
    const closeSharedExhibitModal = queryByTestId("close_shared_exhibit_modal");
    expect(closeSharedExhibitModal).toBeInTheDocument();
});

test("should display the close shared exhibit document modal with not stamped exhibit texts when is not stamped", async () => {
    customDeps.apiService.getEnteredExhibits = jest.fn().mockResolvedValue([]);
    customDeps.apiService.closeExhibit = jest.fn().mockResolvedValue(true);
    customDeps.apiService.getSignedUrl = jest.fn().mockResolvedValue("url");
    customDeps.apiService.getPrivateSignedUrl = jest.fn().mockResolvedValue("url");
    const { queryByText, queryByTestId } = renderWithGlobalContext(
        <ThemeProvider theme={theme}>
            <LiveExhibits />
        </ThemeProvider>,
        customDeps,
        {
            ...rootReducer,
            initialState: {
                signalR: {
                    signalR: null,
                },
                room: {
                    ...rootReducer.initialState.room,
                    isRecording: true,
                    currentExhibitTabName: "liveExhibits",
                    currentExhibit: { ...currentExhibit, preSignedUrl: "", close: true, isPublic: false },
                    stampLabel: "",
                },
            },
        }
    );
    const closeButton = queryByTestId("close_document_button");
    fireEvent.click(closeButton);
    const closeSharedStampedButtonTitle = queryByText(CONSTANTS.MY_EXHIBITS_CLOSE_NOT_STAMPED_MODAL_TITLE);
    expect(closeSharedStampedButtonTitle).toBeInTheDocument();
    const closeSharedStampedButtonSubtitle = queryByText(CONSTANTS.MY_EXHIBITS_CLOSE_NOT_STAMPED_MODAL_SUBTITLE);
    expect(closeSharedStampedButtonSubtitle).toBeInTheDocument();
    const closeSharedStampedPositiveButton = queryByText(CONSTANTS.MY_EXHIBITS_CLOSE_MODAL_CANCEL_BUTTON_LABEL);
    expect(closeSharedStampedPositiveButton).toBeInTheDocument();
    const closeSharedStampedNegativeButton = queryByText(CONSTANTS.MY_EXHIBITS_CLOSE_MODAL_OK_BUTTON_LABEL);
    expect(closeSharedStampedNegativeButton).toBeInTheDocument();
});

test("should display the close shared exhibit document modal with stamped exhibit texts when is stamped", async () => {
    customDeps.apiService.getEnteredExhibits = jest.fn().mockResolvedValue([]);
    customDeps.apiService.closeExhibit = jest.fn().mockResolvedValue(true);
    customDeps.apiService.getSignedUrl = jest.fn().mockResolvedValue("url");
    customDeps.apiService.getPrivateSignedUrl = jest.fn().mockResolvedValue("url");
    const { queryByText, queryByTestId } = renderWithGlobalContext(
        <ThemeProvider theme={theme}>
            <LiveExhibits />
        </ThemeProvider>,
        customDeps,
        {
            ...rootReducer,
            initialState: {
                signalR: {
                    signalR: null,
                },
                room: {
                    ...rootReducer.initialState.room,
                    isRecording: true,
                    currentExhibitTabName: "liveExhibits",
                    currentExhibit: { ...currentExhibit, preSignedUrl: "", close: true, isPublic: false },
                    stampLabel: "Stamp Label",
                },
            },
        }
    );
    const closeButton = queryByTestId("close_document_button");
    fireEvent.click(closeButton);
    const closeSharedStampedButtonTitle = queryByText(CONSTANTS.MY_EXHIBITS_CLOSE_MODAL_TITLE);
    expect(closeSharedStampedButtonTitle).toBeInTheDocument();
    const closeSharedStampedButtonSubtitle = queryByText(CONSTANTS.MY_EXHIBITS_CLOSE_MODAL_SUBTITLE);
    expect(closeSharedStampedButtonSubtitle).toBeInTheDocument();
    const closeSharedStampedPositiveButton = queryByText(CONSTANTS.MY_EXHIBITS_CLOSE_MODAL_OK_BUTTON_LABEL);
    expect(closeSharedStampedPositiveButton).toBeInTheDocument();
    const closeSharedStampedNegativeButton = queryByText(CONSTANTS.MY_EXHIBITS_CLOSE_MODAL_CANCEL_BUTTON_LABEL);
    expect(closeSharedStampedNegativeButton).toBeInTheDocument();
});

test("should display the bring all to me button when the user is the owner of the exhibit", async () => {
    customDeps.apiService.getEnteredExhibits = jest.fn().mockResolvedValue([]);
    customDeps.apiService.closeExhibit = jest.fn().mockResolvedValue(true);
    customDeps.apiService.getSignedUrl = jest.fn().mockResolvedValue("url");
    customDeps.apiService.getPrivateSignedUrl = jest.fn().mockResolvedValue("url");
    const { queryByText, queryByTestId } = renderWithGlobalContext(
        <ThemeProvider theme={theme}>
            <LiveExhibits />
        </ThemeProvider>,
        customDeps,
        {
            ...rootReducer,
            initialState: {
                signalR: {
                    signalR: null,
                },
                room: {
                    ...rootReducer.initialState.room,
                    isRecording: true,
                    currentExhibitTabName: "liveExhibits",
                    currentExhibit: {
                        ...currentExhibit,
                        preSignedUrl: "",
                        close: true,
                        isPublic: false,
                        addedBy: {
                            ...userMock,
                            id: "1",
                        },
                    },
                    currentUser: { ...userMock, id: "1" },
                    stampLabel: "Stamp Label",
                },
            },
        }
    );
    expect(queryByTestId("bring_all_to_me_button")).toBeInTheDocument();
});

test("should not display the bring all to me button when the user is the owner of the exhibit", async () => {
    customDeps.apiService.getEnteredExhibits = jest.fn().mockResolvedValue([]);
    customDeps.apiService.closeExhibit = jest.fn().mockResolvedValue(true);
    customDeps.apiService.getSignedUrl = jest.fn().mockResolvedValue("url");
    customDeps.apiService.getPrivateSignedUrl = jest.fn().mockResolvedValue("url");
    const { queryByText, queryByTestId } = renderWithGlobalContext(
        <ThemeProvider theme={theme}>
            <LiveExhibits />
        </ThemeProvider>,
        customDeps,
        {
            ...rootReducer,
            initialState: {
                signalR: {
                    signalR: null,
                },
                room: {
                    ...rootReducer.initialState.room,
                    isRecording: true,
                    currentExhibitTabName: "liveExhibits",
                    currentExhibit: {
                        ...currentExhibit,
                        preSignedUrl: "",
                        close: true,
                        isPublic: false,
                        addedBy: {
                            ...userMock,
                            id: "1",
                        },
                    },
                    currentUser: { ...userMock, id: "2" },
                    stampLabel: "Stamp Label",
                },
            },
        }
    );
    expect(queryByTestId("bring_all_to_me_button")).not.toBeInTheDocument();
});

test("should not display the bring all to me button when has not any shared exhibit", async () => {
    customDeps.apiService.getEnteredExhibits = jest.fn().mockResolvedValue([]);
    customDeps.apiService.closeExhibit = jest.fn().mockResolvedValue(true);
    customDeps.apiService.getSignedUrl = jest.fn().mockResolvedValue("url");
    customDeps.apiService.getPrivateSignedUrl = jest.fn().mockResolvedValue("url");
    const { queryByText, queryByTestId } = renderWithGlobalContext(
        <ThemeProvider theme={theme}>
            <LiveExhibits />
        </ThemeProvider>,
        customDeps,
        {
            ...rootReducer,
            initialState: {
                signalR: {
                    signalR: null,
                },
                room: {
                    ...rootReducer.initialState.room,
                    isRecording: true,
                    currentExhibitTabName: "liveExhibits",
                    currentExhibit: null,
                    currentUser: { ...userMock, id: "2" },
                    stampLabel: "Stamp Label",
                },
            },
        }
    );
    expect(queryByTestId("bring_all_to_me_button")).not.toBeInTheDocument();
});
