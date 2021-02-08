import "@testing-library/jest-dom";
import { act, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { ThemeProvider } from "styled-components";
import * as CONSTANTS from "../../constants/exhibits";
import { theme } from "../../constants/styles/theme";
import Exhibits from "../../routes/InDepo/Exhibits";
import { ExhibitTabData } from "../../routes/InDepo/Exhibits/ExhibitTabs/ExhibitTabs";
import MyExhibits from "../../routes/InDepo/Exhibits/MyExhibits";
import renderWithGlobalContext from "../utils/renderWithGlobalContext";
import { rootReducer } from "../../state/GlobalState";
import getMockDeps from "../utils/getMockDeps";

import {
    useUploadFile,
    useFileList,
    useSignedUrl,
    useShareExhibitFile,
    useExhibitTabs,
    useExhibitAnnotation,
    useEnteredExhibit,
} from "../../hooks/exhibits/hooks";
import LiveExhibits from "../../routes/InDepo/Exhibits/LiveExhibits";
import EnteredExhibits from "../../routes/InDepo/Exhibits/EnteredExhibits";
jest.mock("../../hooks/exhibits/hooks", () => ({
    useUploadFile: jest.fn(),
    useFileList: jest.fn(),
    useSignedUrl: jest.fn(),
    useShareExhibitFile: jest.fn(),
    useExhibitTabs: jest.fn(),
    useExhibitAnnotation: jest.fn(),
    useEnteredExhibit: jest.fn(),
}));

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
    useShareExhibitFile.mockImplementation(() => ({
        sharedExhibit: {},
    }));
    useExhibitTabs.mockImplementation(() => ({
        highlightKey: 0,
        activeKey: CONSTANTS.DEFAULT_ACTIVE_TAB,
        setActiveKey: jest.fn(),
    }));
    useSignedUrl.mockImplementation(() => ({
        pending: false,
        error: null,
        documentUrl: "",
    }));
    useExhibitAnnotation.mockImplementation(() => ({
        sendAnnotation: jest.fn(),
        annotations: [],
    }));
    useEnteredExhibit.mockImplementation(() => ({
        getEnteredExhibits: jest.fn(),
        enteredExhibits: [],
        enteredExhibitsPending: false,
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

    it.each(CONSTANTS.EXHIBIT_TABS_DATA.map((tab, key) => [tab.title, tab, key]))(
        "should have %s tab with active color when click on it",
        async (title, { tabTestId, tabPaneTestId, tabId }: ExhibitTabData, key) => {
            useExhibitTabs.mockImplementation(() => ({
                highlightKey: key,
                activeKey: tabId,
                setActiveKey: jest.fn(),
            }));
            const { queryByTestId } = renderWithGlobalContext(
                <ThemeProvider theme={theme}>
                    <Exhibits onClick={() => {}} visible />
                </ThemeProvider>
            );
            const tab = queryByTestId(tabTestId);
            await act(async () => userEvent.click(tab));
            const activeTab = queryByTestId(`${tabTestId}_active`);
            expect(activeTab).toBeTruthy();
        }
    );

    it.each(CONSTANTS.EXHIBIT_TABS_DATA.map((tab, key) => [tab.title, tab, key]))(
        "should open %s tTabPane when click on its Tab",
        async (title, { tabTestId, tabPaneTestId, tabId }: ExhibitTabData, key) => {
            useExhibitTabs.mockImplementation(() => ({
                highlightKey: key,
                activeKey: tabId,
                setActiveKey: jest.fn(),
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
            files: [{ displayName: "fileName" }],
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
            files: [{ displayName: "fileName" }],
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
    it("should not display the view document by default", () => {
        useFileList.mockImplementation(() => ({
            files: [{ displayName: "fileName.jpg", preSignedURL: "preSignedURL" }],
        }));
        const { queryByTestId } = renderWithGlobalContext(
            <ThemeProvider theme={theme}>
                <MyExhibits />
            </ThemeProvider>
        );
        const fileViewButton = queryByTestId("file_list_view_button");
        expect(fileViewButton).toBeInTheDocument();
        const exhibitViewerHeader = queryByTestId("view-document-header");
        expect(exhibitViewerHeader).not.toBeInTheDocument();
    });
    it("should display the view document component when click on a file view button", () => {
        useFileList.mockImplementation(() => ({
            files: [{ displayName: "fileName.jpg", preSignedURL: "preSignedURL" }],
        }));
        useSignedUrl.mockImplementation(() => ({
            documentUrl: "documentId",
            pending: false,
        }));
        const { queryByTestId } = renderWithGlobalContext(
            <ThemeProvider theme={theme}>
                <MyExhibits />
            </ThemeProvider>
        );
        const fileViewButton = queryByTestId("file_list_view_button");
        expect(fileViewButton).toBeInTheDocument();
        fireEvent.click(fileViewButton);
        const exhibitViewerHeader = queryByTestId("view-document-header");
        expect(exhibitViewerHeader).toBeInTheDocument();
    });

    it("should spinner be displayed when pending load document", () => {
        useFileList.mockImplementation(() => ({
            files: [{ displayName: "fileName.jpg", preSignedURL: "preSignedURL" }],
        }));
        useSignedUrl.mockImplementation(() => ({
            pending: true,
        }));
        const { queryByTestId } = renderWithGlobalContext(
            <ThemeProvider theme={theme}>
                <MyExhibits />
            </ThemeProvider>
        );
        const fileViewButton = queryByTestId("file_list_view_button");
        expect(fileViewButton).toBeInTheDocument();
        fireEvent.click(fileViewButton);
        const exhibitViewerHeader = queryByTestId("view-document-header");
        expect(exhibitViewerHeader).toBeInTheDocument();
        expect(queryByTestId("spinner")).toBeInTheDocument();
    });

    it("should display file list again after click on the view document's back button", () => {
        useFileList.mockImplementation(() => ({
            files: [{ displayName: "fileName.jpg", preSignedURL: "preSignedURL", id: "documentId" }],
        }));
        useSignedUrl.mockImplementation(() => ({
            documentUrl: "documentId",
            pending: false,
        }));
        const { queryByTestId, getByTestId } = renderWithGlobalContext(
            <ThemeProvider theme={theme}>
                <MyExhibits />
            </ThemeProvider>
        );
        const fileViewButton = queryByTestId("file_list_view_button");
        expect(fileViewButton).toBeInTheDocument();
        fireEvent.click(fileViewButton);
        const exhibitViewerHeader = queryByTestId("view-document-header");
        expect(exhibitViewerHeader).toBeInTheDocument();
        expect(fileViewButton).not.toBeInTheDocument();
        const backButton = getByTestId("view-document-back-button");
        expect(backButton).toBeInTheDocument();
        fireEvent.click(backButton);
        expect(exhibitViewerHeader).not.toBeInTheDocument();
        expect(queryByTestId("file_list_view_button")).toBeInTheDocument();
    });

    it("should display the share document component when click on a file share button", () => {
        useFileList.mockImplementation(() => ({
            files: [{ displayName: "fileName.jpg", preSignedURL: "preSignedURL" }],
        }));
        useSignedUrl.mockImplementation(() => ({
            documentUrl: "documentId",
            pending: false,
        }));
        const { queryByTestId } = renderWithGlobalContext(
            <ThemeProvider theme={theme}>
                <MyExhibits />
            </ThemeProvider>,
            getMockDeps(),
            {
                ...rootReducer,
                initialState: {
                    room: {
                        ...rootReducer.initialState.room,
                        isRecording: true,
                    },
                },
            }
        );
        const ShareFileButton = queryByTestId("file_list_share_button");
        expect(ShareFileButton).toBeInTheDocument();
        fireEvent.click(ShareFileButton);
        const sharedExhibitModal = queryByTestId("share_document_modal");
        expect(sharedExhibitModal).toBeInTheDocument();
    });
    it("should display the share exhibit button disabled when isRecording is false", () => {
        useFileList.mockImplementation(() => ({
            files: [{ displayName: "fileName.jpg", preSignedURL: "preSignedURL" }],
        }));
        useSignedUrl.mockImplementation(() => ({
            documentUrl: "documentId",
            pending: false,
        }));
        const { queryByTestId } = renderWithGlobalContext(
            <ThemeProvider theme={theme}>
                <MyExhibits />
            </ThemeProvider>,
            getMockDeps(),
            {
                ...rootReducer,
                initialState: {
                    room: {
                        ...rootReducer.initialState.room,
                    },
                },
            }
        );
        const ShareFileButton = queryByTestId("file_list_share_button");
        expect(ShareFileButton).toBeDisabled();
    });
    it("should display the share exhibit button enabled when isRecording is true", () => {
        useFileList.mockImplementation(() => ({
            files: [{ displayName: "fileName.jpg", preSignedURL: "preSignedURL" }],
        }));
        useSignedUrl.mockImplementation(() => ({
            documentUrl: "documentId",
            pending: false,
        }));
        const { queryByTestId } = renderWithGlobalContext(
            <ThemeProvider theme={theme}>
                <MyExhibits />
            </ThemeProvider>,
            getMockDeps(),
            {
                ...rootReducer,
                initialState: {
                    room: {
                        ...rootReducer.initialState.room,
                        isRecording: true,
                    },
                },
            }
        );
        const ShareFileButton = queryByTestId("file_list_share_button");
        expect(ShareFileButton).not.toBeDisabled();
    });
    it("should display the share exhibit button on exhibit viewer disabled when isRecording is false", () => {
        useFileList.mockImplementation(() => ({
            files: [{ displayName: "fileName.jpg", preSignedURL: "preSignedURL", id: "documentId" }],
        }));
        useSignedUrl.mockImplementation(() => ({
            documentUrl: "documentId",
            pending: false,
        }));
        const { queryByTestId, getByTestId } = renderWithGlobalContext(
            <ThemeProvider theme={theme}>
                <MyExhibits />
            </ThemeProvider>,
            getMockDeps(),
            {
                ...rootReducer,
                initialState: {
                    room: {
                        ...rootReducer.initialState.room,
                    },
                },
            }
        );
        const fileViewButton = queryByTestId("file_list_view_button");
        expect(fileViewButton).toBeInTheDocument();
        fireEvent.click(fileViewButton);
        const exhibitViewerHeader = queryByTestId("view-document-header");
        expect(exhibitViewerHeader).toBeInTheDocument();
        expect(fileViewButton).not.toBeInTheDocument();
        const shareButton = getByTestId("view_document_share_button");
        expect(shareButton).toBeDisabled();
    });
    it("should display the share exhibit button on exhibit viewer enabled when isRecording is true", () => {
        useFileList.mockImplementation(() => ({
            files: [{ displayName: "fileName.jpg", preSignedURL: "preSignedURL", id: "documentId" }],
        }));
        useSignedUrl.mockImplementation(() => ({
            documentUrl: "documentId",
            pending: false,
        }));
        const { queryByTestId, getByTestId } = renderWithGlobalContext(
            <ThemeProvider theme={theme}>
                <MyExhibits />
            </ThemeProvider>,
            getMockDeps(),
            {
                ...rootReducer,
                initialState: {
                    room: {
                        ...rootReducer.initialState.room,
                        isRecording: true,
                    },
                },
            }
        );
        const fileViewButton = queryByTestId("file_list_view_button");
        expect(fileViewButton).toBeInTheDocument();
        fireEvent.click(fileViewButton);
        const exhibitViewerHeader = queryByTestId("view-document-header");
        expect(exhibitViewerHeader).toBeInTheDocument();
        expect(fileViewButton).not.toBeInTheDocument();
        const shareButton = getByTestId("view_document_share_button");
        expect(shareButton).not.toBeDisabled();
    });

    it("should display the close shared exhibit docuent when has the allowed permissions", () => {
        useShareExhibitFile.mockImplementation(() => ({
            sharedExhibit: { displayName: "fileName.jpg", preSignedURL: "preSignedURL", id: "documentId", close: true },
            closeSharedExhibit: jest.fn(),
        }));
        useExhibitAnnotation.mockImplementation(() => ({
            sendAnnotation: jest.fn(),
            annotations: [],
        }));
        const { queryByTestId } = renderWithGlobalContext(
            <ThemeProvider theme={theme}>
                <LiveExhibits />
            </ThemeProvider>
        );
        const fileViewButton = queryByTestId("close_document_button");
        expect(fileViewButton).toBeInTheDocument();
    });
    it("should not display the close shared exhibit document when has not the allowed permissions", () => {
        useShareExhibitFile.mockImplementation(() => ({
            sharedExhibit: { displayName: "fileName.jpg", preSignedURL: "preSignedURL", id: "documentId" },
            closeSharedExhibit: jest.fn(),
        }));
        useExhibitAnnotation.mockImplementation(() => ({
            sendAnnotation: jest.fn(),
            annotations: [],
        }));
        const { queryByTestId } = renderWithGlobalContext(
            <ThemeProvider theme={theme}>
                <LiveExhibits />
            </ThemeProvider>
        );
        const fileViewButton = queryByTestId("close_document_button");
        expect(fileViewButton).not.toBeInTheDocument();
    });
    it("should display the close shared exhibit docuent modal when after click the button", () => {
        useShareExhibitFile.mockImplementation(() => ({
            sharedExhibit: { displayName: "fileName.jpg", preSignedURL: "preSignedURL", id: "documentId", close: true },
            closeSharedExhibit: jest.fn(),
        }));
        useExhibitAnnotation.mockImplementation(() => ({
            sendAnnotation: jest.fn(),
            annotations: [],
        }));
        const { queryByTestId, queryByText } = renderWithGlobalContext(
            <ThemeProvider theme={theme}>
                <LiveExhibits />
            </ThemeProvider>
        );
        const closeButton = queryByTestId("close_document_button");
        expect(closeButton).toBeInTheDocument();
        fireEvent.click(closeButton);
        const closeSharedExhibitModal = queryByTestId("close_shared_exhibit_modal");
        expect(closeSharedExhibitModal).toBeInTheDocument();
    });
    it("should display the close shared exhibit document modal with stamped exhibit texts when is stamped", () => {
        useShareExhibitFile.mockImplementation(() => ({
            sharedExhibit: { displayName: "fileName.jpg", preSignedURL: "preSignedURL", id: "documentId", close: true },
            closeSharedExhibit: jest.fn(),
        }));
        useExhibitAnnotation.mockImplementation(() => ({
            sendAnnotation: jest.fn(),
            annotations: [],
        }));
        const { queryByTestId, queryByText } = renderWithGlobalContext(
            <ThemeProvider theme={theme}>
                <LiveExhibits />
            </ThemeProvider>,
            getMockDeps(),
            {
                ...rootReducer,
                initialState: {
                    room: {
                        ...rootReducer.initialState.room,
                        isRecording: true,
                        stampLabel: "Stamp Label",
                    },
                },
            }
        );
        const closeButton = queryByTestId("close_document_button");
        expect(closeButton).toBeInTheDocument();
        fireEvent.click(closeButton);
        const closeSharedExhibitModal = queryByTestId("close_shared_exhibit_modal");
        expect(closeSharedExhibitModal).toBeInTheDocument();
        const closeSharedStampedButtonTitle = queryByText(CONSTANTS.MY_EXHIBITS_CLOSE_MODAL_TITLE);
        expect(closeSharedStampedButtonTitle).toBeInTheDocument();
        const closeSharedStampedButtonSubtitle = queryByText(CONSTANTS.MY_EXHIBITS_CLOSE_MODAL_SUBTITLE);
        expect(closeSharedStampedButtonSubtitle).toBeInTheDocument();
        const closeSharedStampedPositiveButton = queryByText(CONSTANTS.MY_EXHIBITS_CLOSE_MODAL_OK_BUTTON_LABEL);
        expect(closeSharedStampedPositiveButton).toBeInTheDocument();
        const closeSharedStampedNegativeButton = queryByText(CONSTANTS.MY_EXHIBITS_CLOSE_MODAL_CANCEL_BUTTON_LABEL);
        expect(closeSharedStampedNegativeButton).toBeInTheDocument();
    });
    it("should display the close shared exhibit document modal with not stamped exhibit texts when is not stamped", () => {
        useShareExhibitFile.mockImplementation(() => ({
            sharedExhibit: { displayName: "fileName.jpg", preSignedURL: "preSignedURL", id: "documentId", close: true },
            closeSharedExhibit: jest.fn(),
        }));
        useExhibitAnnotation.mockImplementation(() => ({
            sendAnnotation: jest.fn(),
            annotations: [],
        }));
        const { queryByTestId, queryByText } = renderWithGlobalContext(
            <ThemeProvider theme={theme}>
                <LiveExhibits />
            </ThemeProvider>,
            getMockDeps(),
            {
                ...rootReducer,
                initialState: {
                    room: {
                        ...rootReducer.initialState.room,
                        isRecording: true,
                        stampLabel: "",
                    },
                },
            }
        );
        const closeButton = queryByTestId("close_document_button");
        expect(closeButton).toBeInTheDocument();
        fireEvent.click(closeButton);
        const closeSharedExhibitModal = queryByTestId("close_shared_exhibit_modal");
        expect(closeSharedExhibitModal).toBeInTheDocument();
        const closeSharedStampedButtonTitle = queryByText(CONSTANTS.MY_EXHIBITS_CLOSE_NOT_STAMPED_MODAL_TITLE);
        expect(closeSharedStampedButtonTitle).toBeInTheDocument();
        const closeSharedStampedButtonSubtitle = queryByText(CONSTANTS.MY_EXHIBITS_CLOSE_NOT_STAMPED_MODAL_SUBTITLE);
        expect(closeSharedStampedButtonSubtitle).toBeInTheDocument();
        const closeSharedStampedPositiveButton = queryByText(CONSTANTS.MY_EXHIBITS_CLOSE_MODAL_CANCEL_BUTTON_LABEL);
        expect(closeSharedStampedPositiveButton).toBeInTheDocument();
        const closeSharedStampedNegativeButton = queryByText(CONSTANTS.MY_EXHIBITS_CLOSE_MODAL_OK_BUTTON_LABEL);
        expect(closeSharedStampedNegativeButton).toBeInTheDocument();
    });

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
        const enteredExhibits = [
            {
                name: "enteredDoc.pdf",
                displayName: "enteredDoc.pdf",
                addedBy: {
                    firstName: "John",
                    LastName: "Doe",
                },
            },
        ];
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
});
