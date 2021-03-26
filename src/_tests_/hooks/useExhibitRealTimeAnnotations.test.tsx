import { renderHook, act } from "@testing-library/react-hooks";
import { useExhibitRealTimeAnnotations } from "../../hooks/exhibits/hooks";

import {
    annotationsNotificationMessageWithContent,
    transcriptNotificationMessageWithContent,
} from "../mocks/notificationMessage";
import state from "../mocks/state";
import getMockDeps from "../utils/getMockDeps";
import { defineProviderValues } from "../../state/GlobalState";

import useSignalR from "../../hooks/useSignalR";
jest.mock("../../hooks/useSignalR", () => ({
    __esModule: true,
    default: jest.fn(),
}));

test("should return a null annotation data when the notification is distinct to annotation", () => {
    const deps = getMockDeps();
    const currentRoomStateMock = {
        room: {
            ...state.state.room,
            currentUser: { id: "2" },
        },
    };

    const customWrapper = ({ children }) => defineProviderValues(currentRoomStateMock, state.dispatch, deps, children);
    useSignalR.mockImplementation(() => ({
        subscribeToGroup: jest.fn((url, callback) => callback(transcriptNotificationMessageWithContent)),
        unsubscribeMethodFromGroup: jest.fn(),
    }));
    const { result } = renderHook(() => useExhibitRealTimeAnnotations(), { wrapper: customWrapper });
    const { realTimeAnnotation } = result.current;
    expect(realTimeAnnotation).toBeNull();
});

test("should return a null annotation data when the user that created the annotation is the same to the annotation notification received ", () => {
    const deps = getMockDeps();
    const currentRoomStateMock = {
        room: {
            ...state.state.room,
            currentUser: { id: "1" },
        },
    };

    const customWrapper = ({ children }) => defineProviderValues(currentRoomStateMock, state.dispatch, deps, children);
    useSignalR.mockImplementation(() => ({
        subscribeToGroup: jest.fn((url, callback) => callback(annotationsNotificationMessageWithContent)),
        unsubscribeMethodFromGroup: jest.fn(),
    }));
    const { result } = renderHook(() => useExhibitRealTimeAnnotations(), { wrapper: customWrapper });
    const { realTimeAnnotation } = result.current;
    expect(realTimeAnnotation).toBeNull();
});

test("should return a not null annotation data when has an annotation notification and is received from another user", () => {
    const deps = getMockDeps();
    const currentRoomStateMock = {
        room: {
            ...state.state.room,
            currentUser: { id: "2" },
        },
    };

    const customWrapper = ({ children }) => defineProviderValues(currentRoomStateMock, state.dispatch, deps, children);
    useSignalR.mockImplementation(() => ({
        subscribeToGroup: jest.fn((url, callback) => callback(annotationsNotificationMessageWithContent)),
        unsubscribeMethodFromGroup: jest.fn(),
    }));
    const { result } = renderHook(() => useExhibitRealTimeAnnotations(), { wrapper: customWrapper });
    const { realTimeAnnotation } = result.current;
    expect(realTimeAnnotation).toBe(annotationsNotificationMessageWithContent.content.details);
});

test("should call the unsubscribeMethodFromGroup function when the hook is unmounted", () => {
    const deps = getMockDeps();
    const currentRoomStateMock = {
        room: {
            ...state.state.room,
            currentUser: { id: "2" },
        },
    };

    const customWrapper = ({ children }) => defineProviderValues(currentRoomStateMock, state.dispatch, deps, children);
    const unsubscribeMethodFromGroup = jest.fn();
    useSignalR.mockImplementation(() => ({
        subscribeToGroup: jest.fn((url, callback) => callback(annotationsNotificationMessageWithContent)),
        unsubscribeMethodFromGroup,
    }));
    const { result, unmount } = renderHook(() => useExhibitRealTimeAnnotations(), { wrapper: customWrapper });
    const { realTimeAnnotation } = result.current;
    act(() => {
        unmount();
    });
    expect(unsubscribeMethodFromGroup).toBeCalled();
});
