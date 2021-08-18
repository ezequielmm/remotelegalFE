import "@testing-library/jest-dom";
import { act, fireEvent, waitFor, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "styled-components";
import * as CONSTANTS from "../../constants/exhibits";
import { theme } from "../../constants/styles/theme";
import Exhibits from "../../routes/InDepo/Exhibits";
import { ExhibitTabData } from "../../routes/InDepo/Exhibits/ExhibitTabs/ExhibitTabs";
import MyExhibits from "../../routes/InDepo/Exhibits/MyExhibits";
import renderWithGlobalContext from "../utils/renderWithGlobalContext";
import { rootReducer } from "../../state/GlobalState";
import getMockDeps from "../utils/getMockDeps";
import { useEnteredExhibit } from "../../hooks/useEnteredExhibits";

import {
    useUploadFile,
    useFileList,
    useSignedUrl,
    useShareExhibitFile,
    useExhibitTabs,
    useExhibitGetAnnotations,
    useExhibitRealTimeAnnotations,
    useExhibitSendAnnotation,
    useBringAllToMe,
    useCloseSharedExhibit,
} from "../../hooks/exhibits/hooks";
import LiveExhibits from "../../routes/InDepo/Exhibits/LiveExhibits";
import EnteredExhibits from "../../routes/InDepo/Exhibits/EnteredExhibits";

jest.mock("../../hooks/useEnteredExhibits", () => ({
    useEnteredExhibit: jest.fn(),
}));

jest.mock("../../hooks/exhibits/hooks", () => ({
    useUploadFile: jest.fn(),
    useFileList: jest.fn(),
    useSignedUrl: jest.fn(),
    useShareExhibitFile: jest.fn(),
    useExhibitTabs: jest.fn(),
    useExhibitAnnotation: jest.fn(),
    useExhibitGetAnnotations: jest.fn(),
    useExhibitRealTimeAnnotations: jest.fn(),
    useExhibitSendAnnotation: jest.fn(),
    useBringAllToMe: jest.fn(),
    useCloseSharedExhibit: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"), // use actual for all non-hook parts
    useParams: () => ({
        depositionID: "depositionIDXXXX",
    }),
}));

let customDeps;

beforeEach(() => {
    customDeps = getMockDeps();
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
    useExhibitGetAnnotations.mockImplementation(() => ({
        sendAnnotation: jest.fn(),
        annotations: [],
    }));
    useEnteredExhibit.mockImplementation(() => ({
        getEnteredExhibits: jest.fn(),
        enteredExhibits: [],
        enteredExhibitsPending: false,
    }));
    useExhibitRealTimeAnnotations.mockImplementation(() => ({
        realTimeAnnotation: null,
    }));
    useExhibitSendAnnotation.mockImplementation(() => ({
        sendAnnotation: jest.fn(),
    }));

    useEnteredExhibit.mockImplementation(() => ({
        handleFetchFiles: jest.fn(),
    }));
    useBringAllToMe.mockImplementation(() => ({
        setBringAllToPage: jest.fn(),
        bringAllToMe: jest.fn(),
    }));
    useCloseSharedExhibit.mockImplementation(() => ({
        closeSharedExhibit: jest.fn(),
        pendingCloseSharedExhibit: false,
    }));
});

describe("Exhibits", () => {
    it.each(CONSTANTS.EXHIBIT_TABS_DATA.map((tab) => [tab.title, tab]))(
        "should have %s tab active only if it's the default tab",
        async (title, { tabId, tabTestId }: ExhibitTabData) => {
            renderWithGlobalContext(
                <ThemeProvider theme={theme}>
                    <Exhibits onClick={() => {}} visible />
                </ThemeProvider>
            );
            const activeTab = screen.queryByTestId(`${tabTestId}_active`);
            if (tabId === CONSTANTS.DEFAULT_ACTIVE_TAB) {
                expect(activeTab).toBeTruthy();
            } else {
                expect(activeTab).toBeFalsy();
            }
        }
    );

    it.each(CONSTANTS.EXHIBIT_TABS_DATA.map((tab, key) => [tab.title, tab, key]))(
        "should have %s tab with active color when click on it",
        async (_, { tabTestId, tabId }: ExhibitTabData, key) => {
            useExhibitTabs.mockImplementation(() => ({
                highlightKey: key,
                activeKey: tabId,
                setActiveKey: jest.fn(),
            }));
            renderWithGlobalContext(
                <ThemeProvider theme={theme}>
                    <Exhibits onClick={() => {}} visible />
                </ThemeProvider>
            );
            const tab = screen.queryByTestId(tabTestId);
            await act(async () => userEvent.click(tab));
            const activeTab = screen.queryByTestId(`${tabTestId}_active`);
            expect(activeTab).toBeTruthy();
        }
    );

    it.each(CONSTANTS.EXHIBIT_TABS_DATA.map((tab, key) => [tab.title, tab, key]))(
        "should open %s tTabPane when click on its Tab",
        async (_, { tabTestId, tabPaneTestId, tabId }: ExhibitTabData, key) => {
            useExhibitTabs.mockImplementation(() => ({
                highlightKey: key,
                activeKey: tabId,
                setActiveKey: jest.fn(),
            }));
            renderWithGlobalContext(
                <ThemeProvider theme={theme}>
                    <Exhibits onClick={() => {}} visible />
                </ThemeProvider>
            );
            const tab = screen.getByTestId(tabTestId);
            await act(async () => userEvent.click(tab));
            const tabPane = screen.getByTestId(tabPaneTestId);
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
        renderWithGlobalContext(
            <ThemeProvider theme={theme}>
                <MyExhibits />
            </ThemeProvider>
        );
        const fileListTable = screen.queryByTestId("file_list_table");
        expect(fileListTable).toBeInTheDocument();
    });

    it("should not display the file list when has zero file in the list", async () => {
        useFileList.mockImplementation(() => ({
            files: [],
        }));
        renderWithGlobalContext(
            <ThemeProvider theme={theme}>
                <MyExhibits />
            </ThemeProvider>
        );
        const fileListTable = screen.queryByTestId("file_list_table");
        expect(fileListTable).not.toBeInTheDocument();
    });

    it("should not display the empty state component when has more than file in the list", async () => {
        useFileList.mockImplementation(() => ({
            files: [{ displayName: "fileName" }],
        }));
        renderWithGlobalContext(
            <ThemeProvider theme={theme}>
                <MyExhibits />
            </ThemeProvider>
        );
        const fileListTable = screen.queryByTestId("file_list_table");
        const noExhibitComponent = screen.queryByText("No exhibits added yet");
        expect(fileListTable).toBeInTheDocument();
        expect(noExhibitComponent).not.toBeInTheDocument();
    });

    it("should not display the empty state component when has zero file in the list", async () => {
        useFileList.mockImplementation(() => ({
            files: [],
        }));
        renderWithGlobalContext(
            <ThemeProvider theme={theme}>
                <MyExhibits />
            </ThemeProvider>
        );
        const fileListTable = screen.queryByTestId("file_list_table");
        const noExhibitComponent = screen.queryByText("No exhibits added yet");
        expect(fileListTable).not.toBeInTheDocument();
        expect(noExhibitComponent).toBeInTheDocument();
    });

    it("should not display the view document by default", () => {
        useFileList.mockImplementation(() => ({
            files: [{ displayName: "fileName.jpg", preSignedURL: "preSignedURL" }],
        }));
        renderWithGlobalContext(
            <ThemeProvider theme={theme}>
                <MyExhibits />
            </ThemeProvider>
        );
        const fileViewButton = screen.queryByTestId("file_list_view_button");
        expect(fileViewButton).toBeInTheDocument();
        const exhibitViewerHeader = screen.queryByTestId("view_document_header");
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
        renderWithGlobalContext(
            <ThemeProvider theme={theme}>
                <MyExhibits />
            </ThemeProvider>
        );
        const fileViewButton = screen.queryByTestId("file_list_view_button");
        expect(fileViewButton).toBeInTheDocument();
        fireEvent.click(fileViewButton);
        const exhibitViewerHeader = screen.queryByTestId("view_document_header");
        expect(exhibitViewerHeader).toBeInTheDocument();
    });

    it("should spinner be displayed when pending load document", () => {
        useFileList.mockImplementation(() => ({
            files: [{ displayName: "fileName.jpg", preSignedURL: "preSignedURL" }],
        }));
        useSignedUrl.mockImplementation(() => ({
            pending: true,
        }));
        renderWithGlobalContext(
            <ThemeProvider theme={theme}>
                <MyExhibits />
            </ThemeProvider>
        );
        const fileViewButton = screen.queryByTestId("file_list_view_button");
        expect(fileViewButton).toBeInTheDocument();
        fireEvent.click(fileViewButton);
        const exhibitViewerHeader = screen.queryByTestId("view_document_header");
        expect(exhibitViewerHeader).toBeInTheDocument();
        expect(screen.queryByTestId("spinner")).toBeInTheDocument();
    });

    it("should display file list again after click on the view document's back button", () => {
        useFileList.mockImplementation(() => ({
            files: [{ displayName: "fileName.jpg", preSignedURL: "preSignedURL", id: "documentId" }],
        }));
        useSignedUrl.mockImplementation(() => ({
            documentUrl: "documentId",
            pending: false,
        }));
        renderWithGlobalContext(
            <ThemeProvider theme={theme}>
                <MyExhibits />
            </ThemeProvider>
        );
        const fileViewButton = screen.queryByTestId("file_list_view_button");
        expect(fileViewButton).toBeInTheDocument();
        fireEvent.click(fileViewButton);
        const exhibitViewerHeader = screen.queryByTestId("view_document_header");
        expect(exhibitViewerHeader).toBeInTheDocument();
        expect(fileViewButton).not.toBeInTheDocument();
        const backButton = screen.getByTestId("view-document-back-button");
        expect(backButton).toBeInTheDocument();
        fireEvent.click(backButton);
        expect(exhibitViewerHeader).not.toBeInTheDocument();
        expect(screen.queryByTestId("file_list_view_button")).toBeInTheDocument();
    });

    it("should display the share document component when click on a file share button", () => {
        useFileList.mockImplementation(() => ({
            files: [{ displayName: "fileName.jpg", preSignedURL: "preSignedURL" }],
        }));
        useSignedUrl.mockImplementation(() => ({
            documentUrl: "documentId",
            pending: false,
        }));
        renderWithGlobalContext(
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
                    },
                },
            }
        );
        const shareFileButton = screen.queryByTestId("file_list_share_button");
        expect(shareFileButton).toBeInTheDocument();
        fireEvent.click(shareFileButton);
        const sharedExhibitModal = screen.queryByTestId("share_document_modal");
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
        renderWithGlobalContext(
            <ThemeProvider theme={theme}>
                <MyExhibits />
            </ThemeProvider>,
            customDeps,
            {
                ...rootReducer,
                initialState: {
                    room: {
                        ...rootReducer.initialState.room,
                    },
                },
            }
        );
        const shareFileButton = screen.queryByTestId("file_list_share_button");
        expect(shareFileButton).toBeDisabled();
    });

    it("should display the share exhibit button enabled when isRecording is true", () => {
        useFileList.mockImplementation(() => ({
            files: [{ displayName: "fileName.jpg", preSignedURL: "preSignedURL" }],
        }));
        useSignedUrl.mockImplementation(() => ({
            documentUrl: "documentId",
            pending: false,
        }));
        renderWithGlobalContext(
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
                    },
                },
            }
        );
        const shareFileButton = screen.queryByTestId("file_list_share_button");
        expect(shareFileButton).not.toBeDisabled();
    });

    it("should display the share exhibit button on exhibit viewer disabled when isRecording is false", () => {
        useFileList.mockImplementation(() => ({
            files: [{ displayName: "fileName.jpg", preSignedURL: "preSignedURL", id: "documentId" }],
        }));
        useSignedUrl.mockImplementation(() => ({
            documentUrl: "documentId",
            pending: false,
        }));
        renderWithGlobalContext(
            <ThemeProvider theme={theme}>
                <MyExhibits />
            </ThemeProvider>,
            customDeps,
            {
                ...rootReducer,
                initialState: {
                    room: {
                        ...rootReducer.initialState.room,
                    },
                },
            }
        );
        const fileViewButton = screen.queryByTestId("file_list_view_button");
        expect(fileViewButton).toBeInTheDocument();
        fireEvent.click(fileViewButton);
        const exhibitViewerHeader = screen.queryByTestId("view_document_header");
        expect(exhibitViewerHeader).toBeInTheDocument();
        expect(fileViewButton).not.toBeInTheDocument();
        const shareButton = screen.getByTestId("view_document_share_button");
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
        renderWithGlobalContext(
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
                    },
                },
            }
        );
        const fileViewButton = screen.queryByTestId("file_list_view_button");
        expect(fileViewButton).toBeInTheDocument();
        fireEvent.click(fileViewButton);
        const exhibitViewerHeader = screen.queryByTestId("view_document_header");
        expect(exhibitViewerHeader).toBeInTheDocument();
        expect(fileViewButton).not.toBeInTheDocument();
        const shareButton = screen.getByTestId("view_document_share_button");
        expect(shareButton).not.toBeDisabled();
    });

    it.each(CONSTANTS.SUPPORTED_AUDIO_VIDEO_FILES.map((extension, key) => [extension, key]))(
        "should display custom video player if the exhibit extension is %s",
        async (ext) => {
            useFileList.mockImplementation(() => ({
                files: [
                    {
                        name: `fileName.${ext}`,
                        displayName: `fileName.${ext}`,
                        preSignedURL: "preSignedURL",
                        id: "documentId",
                    },
                ],
                handleFetchFiles: () => {},
            }));
            useSignedUrl.mockImplementation(() => ({
                documentUrl: "documentId",
                pending: false,
            }));
            renderWithGlobalContext(
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
                            currentExhibitTabName: CONSTANTS.EXHIBIT_TABS.myExhibits,
                        },
                        postDepo: {
                            changeTime: { time: 1 },
                            currentTime: 1,
                            playing: true,
                            duration: 1,
                        },
                    },
                }
            );
            const fileViewButton = screen.queryByTestId("file_list_view_button");
            expect(fileViewButton).toBeInTheDocument();
            fireEvent.click(fileViewButton);
            await waitFor(() => {
                expect(screen.queryByTestId("video_player")).toBeInTheDocument();
            });
        }
    );

    it("should display the stamp label for audio or video exhibits on entered exhibits view section", async () => {
        useSignedUrl.mockImplementation(() => ({
            documentUrl: "documentId",
            pending: false,
            isPublic: false,
        }));
        useEnteredExhibit.mockImplementation(() => ({
            handleFetchFiles: jest.fn(),
            enteredExhibits: [
                {
                    name: "name.mp4",
                    displayName: "name.mp4",
                    preSignedURL: "preSignedURL",
                    id: "documentId",
                    stampLabel: "stamp-label",
                },
            ],
            enteredExhibitsPending: false,
        }));

        renderWithGlobalContext(
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
                        currentExhibitTabName: CONSTANTS.EXHIBIT_TABS.enteredExhibits,
                        permissions: ["StampExhibit"],
                    },
                    postDepo: {
                        changeTime: { time: 1 },
                        currentTime: 1,
                        playing: true,
                        duration: 1,
                    },
                },
            }
        );
        await waitFor(() => expect(screen.queryByTestId("entered_exhibits_table")).toBeInTheDocument());
        const fileViewButton = screen.queryByTestId("file_list_view_button");
        expect(fileViewButton).toBeInTheDocument();
        fireEvent.click(fileViewButton);
        await waitFor(() => expect(screen.queryByTestId("stamp_label")).toBeInTheDocument());
        expect(screen.queryByTestId("stamp_label")).toHaveTextContent("stamp-label");
    });

    it("should display the stamp label for audio or video exhibits on live exhibit view section", async () => {
        useSignedUrl.mockImplementation(() => ({
            documentUrl: "documentId",
            pending: false,
            isPublic: false,
            stampLabel: "stamp-label",
        }));

        renderWithGlobalContext(
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
                        currentExhibitTabName: CONSTANTS.EXHIBIT_TABS.liveExhibits,
                        permissions: ["StampExhibit"],
                        currentExhibit: {
                            name: "name.mp4",
                            displayName: "name.mp4",
                            id: "documentId",
                            size: 1,
                            stampLabel: "stamp-label",
                        },
                    },
                    postDepo: {
                        changeTime: { time: 1 },
                        currentTime: 1,
                        playing: true,
                        duration: 1,
                    },
                    user: { currentUser: { firstName: "First Name", lastName: "Last Name" } },
                },
            }
        );
        await waitFor(() => expect(screen.queryByTestId("stamp_label")).toBeInTheDocument());
        expect(screen.queryByTestId("stamp_label")).toHaveTextContent("stamp-label");
    });

    it("should not display the stamp label for a not audio or video exhibits on live exhibit view section", async () => {
        useSignedUrl.mockImplementation(() => ({
            documentUrl: "documentId",
            pending: false,
            isPublic: false,
            stampLabel: "stamp-label",
        }));

        renderWithGlobalContext(
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
                        currentExhibitTabName: CONSTANTS.EXHIBIT_TABS.liveExhibits,
                        permissions: ["StampExhibit"],
                        currentExhibit: {
                            name: "name.pdf",
                            displayName: "name.pdf",
                            id: "documentId",
                            size: 1,
                            stampLabel: "stamp-label",
                        },
                    },
                    postDepo: {
                        changeTime: { time: 1 },
                        currentTime: 1,
                        playing: true,
                        duration: 1,
                    },
                    user: { currentUser: { firstName: "First Name", lastName: "Last Name" } },
                },
            }
        );
        await waitFor(() => expect(screen.queryByTestId("stamp_label")).not.toBeInTheDocument());
    });

    it("should not display the stamp label for audio or video exhibits on entered exhibits view section if it is not an audio/video", async () => {
        useSignedUrl.mockImplementation(() => ({
            documentUrl: "documentId",
            pending: false,
            isPublic: false,
        }));
        useEnteredExhibit.mockImplementation(() => ({
            handleFetchFiles: jest.fn(),
            enteredExhibits: [
                {
                    name: "name.pdf",
                    displayName: "name.pdf",
                    preSignedURL: "preSignedURL",
                    id: "documentId",
                    stampLabel: "stamp-label",
                },
            ],
            enteredExhibitsPending: false,
        }));
        renderWithGlobalContext(
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
                        currentExhibitTabName: CONSTANTS.EXHIBIT_TABS.enteredExhibits,
                        permissions: ["StampExhibit"],
                    },
                    postDepo: {
                        changeTime: { time: 1 },
                        currentTime: 1,
                        playing: true,
                        duration: 1,
                    },
                },
            }
        );
        await waitFor(() => expect(screen.queryByTestId("entered_exhibits_table")).toBeInTheDocument());
        const fileViewButton = screen.queryByTestId("file_list_view_button");
        expect(fileViewButton).toBeInTheDocument();
        fireEvent.click(fileViewButton);
        expect(screen.queryByTestId("stamp_label")).not.toBeInTheDocument();
    });

    it("should not display the stamp label for audio or video exhibits, if it is null, on entered exhibits view section", async () => {
        useSignedUrl.mockImplementation(() => ({
            documentUrl: "documentId",
            pending: false,
            isPublic: false,
        }));
        useEnteredExhibit.mockImplementation(() => ({
            handleFetchFiles: jest.fn(),
            enteredExhibits: [
                {
                    name: "name.mp4",
                    displayName: "name.mp4",
                    preSignedURL: "preSignedURL",
                    id: "documentId",
                },
            ],
            enteredExhibitsPending: false,
        }));
        renderWithGlobalContext(
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
                        currentExhibitTabName: CONSTANTS.EXHIBIT_TABS.enteredExhibits,
                        permissions: ["StampExhibit"],
                    },
                    postDepo: {
                        changeTime: { time: 1 },
                        currentTime: 1,
                        playing: true,
                        duration: 1,
                    },
                },
            }
        );
        await waitFor(() => expect(screen.queryByTestId("entered_exhibits_table")).toBeInTheDocument());
        const fileViewButton = screen.queryByTestId("file_list_view_button");
        expect(fileViewButton).toBeInTheDocument();
        fireEvent.click(fileViewButton);
        await waitFor(() => expect(screen.queryByTestId("stamp_label")).not.toBeInTheDocument());
    });

    it("should able to download the audio/video exhibit", async () => {
        useSignedUrl.mockImplementation(() => ({
            documentUrl: "documentId",
            pending: false,
            isPublic: false,
        }));
        useEnteredExhibit.mockImplementation(() => ({
            handleFetchFiles: jest.fn(),
            enteredExhibits: [
                {
                    name: "name.mp4",
                    displayName: "name.mp4",
                    preSignedURL: "preSignedURL",
                    id: "documentId",
                },
            ],
            enteredExhibitsPending: false,
        }));
        renderWithGlobalContext(
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
                        currentExhibitTabName: CONSTANTS.EXHIBIT_TABS.enteredExhibits,
                        permissions: ["StampExhibit"],
                    },
                    postDepo: {
                        changeTime: { time: 1 },
                        currentTime: 1,
                        playing: true,
                        duration: 1,
                    },
                },
            }
        );
        await waitFor(() => expect(screen.queryByTestId("entered_exhibits_table")).toBeInTheDocument());
        const fileViewButton = screen.queryByTestId("file_list_view_button");
        expect(fileViewButton).toBeInTheDocument();
        fireEvent.click(fileViewButton);
        await waitFor(() => expect(screen.queryByTestId("view_document_download")).toBeInTheDocument());
    });

    it("should not able to download the audio/video exhibit when has not download url", async () => {
        useSignedUrl.mockImplementation(() => ({
            pending: false,
            isPublic: false,
        }));
        useEnteredExhibit.mockImplementation(() => ({
            handleFetchFiles: jest.fn(),
            enteredExhibits: [
                {
                    name: "name.mp4",
                    displayName: "name.mp4",
                    preSignedURL: "preSignedURL",
                    id: "documentId",
                },
            ],
            enteredExhibitsPending: false,
        }));
        renderWithGlobalContext(
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
                        currentExhibitTabName: CONSTANTS.EXHIBIT_TABS.enteredExhibits,
                        permissions: ["StampExhibit"],
                    },
                    postDepo: {
                        changeTime: { time: 1 },
                        currentTime: 1,
                        playing: true,
                        duration: 1,
                    },
                },
            }
        );
        await waitFor(() => expect(screen.queryByTestId("entered_exhibits_table")).toBeInTheDocument());
        const fileViewButton = screen.queryByTestId("file_list_view_button");
        expect(fileViewButton).toBeInTheDocument();
        fireEvent.click(fileViewButton);
        await waitFor(() => expect(screen.queryByTestId("view_document_download")).not.toBeInTheDocument());
    });

    it("should not able to download the audio/video exhibit when the exhibit is not an audio/video", async () => {
        useSignedUrl.mockImplementation(() => ({
            documentUrl: "documentId",
            pending: false,
            isPublic: false,
        }));
        useEnteredExhibit.mockImplementation(() => ({
            handleFetchFiles: jest.fn(),
            enteredExhibits: [
                {
                    name: "name.pdf",
                    displayName: "name.pdf",
                    preSignedURL: "preSignedURL",
                    id: "documentId",
                },
            ],
            enteredExhibitsPending: false,
        }));
        renderWithGlobalContext(
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
                        currentExhibitTabName: CONSTANTS.EXHIBIT_TABS.enteredExhibits,
                        permissions: ["StampExhibit"],
                    },
                    postDepo: {
                        changeTime: { time: 1 },
                        currentTime: 1,
                        playing: true,
                        duration: 1,
                    },
                },
            }
        );
        await waitFor(() => expect(screen.queryByTestId("entered_exhibits_table")).toBeInTheDocument());
        const fileViewButton = screen.queryByTestId("file_list_view_button");
        expect(fileViewButton).toBeInTheDocument();
        fireEvent.click(fileViewButton);
        await waitFor(() => expect(screen.queryByTestId("view_document_download")).not.toBeInTheDocument());
    });

    it("should not able to stamp for a stamped audio or video exhibits on live exhibit view section", async () => {
        useSignedUrl.mockImplementation(() => ({
            documentUrl: "documentId",
            pending: false,
            isPublic: false,
            stampLabel: "stamp-label",
        }));

        renderWithGlobalContext(
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
                        currentExhibitTabName: CONSTANTS.EXHIBIT_TABS.liveExhibits,
                        exhibitTab: CONSTANTS.EXHIBIT_TABS.liveExhibits,
                        permissions: ["StampExhibit"],
                        currentExhibit: {
                            name: "name.mp4",
                            displayName: "name.mp4",
                            id: "documentId",
                            size: 1,
                            stampLabel: "stamp-label",
                        },
                    },
                    postDepo: {
                        changeTime: { time: 1 },
                        currentTime: 1,
                        playing: true,
                        duration: 1,
                    },
                    user: { currentUser: { firstName: "First Name", lastName: "Last Name" } },
                },
            }
        );
        const stampButton = screen.queryByTestId("view_document_stamp");
        await waitFor(() => expect(stampButton).toBeInTheDocument());
        fireEvent.click(stampButton);
        await waitFor(() =>
            expect(screen.queryByText("Please delete the existing stamp and try again")).toBeInTheDocument()
        );
    });
});
