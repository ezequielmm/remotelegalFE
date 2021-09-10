import React from "react";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { act } from "@testing-library/react-hooks";
import MediaViewer from "../../components/PDFTronViewer/components/MediaViewer";
import { rootReducer } from "../../state/GlobalState";
import renderWithGlobalContext from "../utils/renderWithGlobalContext";
import getMockDeps from "../utils/getMockDeps";

test("Should show the stamp label after save on the store", () => {
    renderWithGlobalContext(<MediaViewer url="url" />, getMockDeps(), {
        ...rootReducer,
        initialState: {
            room: {
                ...rootReducer.initialState.room,
                timeZone: 1,
                stampLabel: "stamp-label",
            },
            postDepo: {
                changeTime: { time: 1 },
                currentTime: 1,
                playing: true,
                duration: 1,
            },
        },
    });
    expect(screen.getByText("stamp-label")).toBeInTheDocument();
    expect(screen.queryByTestId("stamp_label")).toBeInTheDocument();
});

test("Should show the stamp label from the exhibit file info", () => {
    renderWithGlobalContext(<MediaViewer url="url" stampLabelFromFile="stamp-from-file" />, getMockDeps(), {
        ...rootReducer,
        initialState: {
            room: {
                ...rootReducer.initialState.room,
                timeZone: 1,
            },
            postDepo: {
                changeTime: { time: 1 },
                currentTime: 1,
                playing: true,
                duration: 1,
            },
        },
    });
    expect(screen.queryByText("stamp-from-file")).toBeInTheDocument();
    expect(screen.queryByTestId("stamp_label")).toBeInTheDocument();
});

test("Should not show the stamp label if it is not set from the store or from the file", () => {
    renderWithGlobalContext(<MediaViewer url="url" />, getMockDeps(), {
        ...rootReducer,
        initialState: {
            room: {
                ...rootReducer.initialState.room,
                timeZone: 1,
            },
            postDepo: {
                changeTime: { time: 1 },
                currentTime: 1,
                playing: true,
                duration: 1,
            },
        },
    });
    expect(screen.queryByTestId("stamp_label")).not.toBeInTheDocument();
});

test("Should show the delete button after click on the stamp container", async () => {
    renderWithGlobalContext(<MediaViewer url="url" />, getMockDeps(), {
        ...rootReducer,
        initialState: {
            room: {
                ...rootReducer.initialState.room,
                timeZone: 1,
                stampLabel: "stamp-label",
            },
            postDepo: {
                changeTime: { time: 1 },
                currentTime: 1,
                playing: true,
                duration: 1,
            },
        },
    });
    expect(screen.queryByTestId("stamp_label_delete_button")).not.toBeInTheDocument();
    await act(async () => {
        fireEvent.click(await screen.queryByTestId("stamp_label"));
    });
    await waitFor(() => expect(screen.queryByTestId("stamp_label_delete_button")).toBeInTheDocument());
});

test("Should show the stamp timeout label", () => {
    renderWithGlobalContext(<MediaViewer url="url" />, getMockDeps(), {
        ...rootReducer,
        initialState: {
            room: {
                ...rootReducer.initialState.room,
                timeZone: 1,
                stampLabel: "stamp-label",
            },
            postDepo: {
                changeTime: { time: 1 },
                currentTime: 1,
                playing: true,
                duration: 1,
            },
        },
    });
    expect(screen.queryByTestId("stamp_label_timestamp")).toBeInTheDocument();
});
