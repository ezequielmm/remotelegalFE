import { renderHook, act } from "@testing-library/react-hooks";
import { useStampMediaExhibits } from "../../hooks/exhibits/hooks";
import useSignalR from "../../hooks/useSignalR";
import { defineProviderValues } from "../../state/GlobalState";
import actions from "../../state/InDepo/InDepoActions";
import { stampNotificationMessageWithContent, stampNotificationMessageWithError } from "../mocks/notificationMessage";
import state from "../mocks/state";
import Message from "../../components/Message";
import getMockDeps from "../utils/getMockDeps";
jest.mock("../../hooks/useSignalR", () => ({
    __esModule: true,
    default: jest.fn(),
}));

jest.mock("react-router", () => ({
    ...jest.requireActual("react-router-dom"), // use actual for all non-hook parts
    useParams: () => ({
        depositionID: "depositionIDXXXX",
    }),
}));

jest.mock("../../components/Message", () => ({
    __esModule: true,
    default: jest.fn(),
}));

test("should sendMessage and dispatch an action after call stamp", () => {
    const deps = getMockDeps();
    const stampLabel = "stampLabel";
    const customWrapper = ({ children }) => defineProviderValues({}, state.dispatch, deps, children);
    const sendMessage = jest.fn();
    useSignalR.mockImplementation(() => ({
        subscribeToGroup: jest.fn(),
        unsubscribeMethodFromGroup: jest.fn(),
        signalR: { connectionState: "Connected" },
        isReconnected: true,
        sendMessage,
    }));
    const { result } = renderHook(() => useStampMediaExhibits(), { wrapper: customWrapper });
    const stamp = result.current;
    act(() => {
        stamp(stampLabel);
    });
    expect(sendMessage).toBeCalled();
    expect(state.dispatch).toHaveBeenCalledWith(actions.setStampLabel(stampLabel));
});

test("should not sendMessage and dispatch an action after call stamp but signalR is not connected and is not reconnected", () => {
    const deps = getMockDeps();
    const stampLabel = "stampLabel";
    const customWrapper = ({ children }) => defineProviderValues({}, state.dispatch, deps, children);
    const sendMessage = jest.fn();
    useSignalR.mockImplementation(() => ({
        subscribeToGroup: jest.fn(),
        unsubscribeMethodFromGroup: jest.fn(),
        signalR: { connectionState: "Not Connected" },
        isReconnected: false,
        sendMessage,
    }));
    const { result } = renderHook(() => useStampMediaExhibits(), { wrapper: customWrapper });
    const stamp = result.current;
    act(() => {
        stamp(stampLabel);
    });
    expect(sendMessage).not.toBeCalled();
    expect(state.dispatch).not.toHaveBeenCalledWith(actions.setStampLabel(stampLabel));
});

test("should update the stamp state after receive a NotificationEntityType.stamp notification from signalr", () => {
    const deps = getMockDeps();
    const stampLabel = "stampLabel";
    const customWrapper = ({ children }) => defineProviderValues({}, state.dispatch, deps, children);
    const sendMessage = jest.fn();
    useSignalR.mockImplementation(() => ({
        subscribeToGroup: jest.fn((url, callback) => callback(stampNotificationMessageWithContent)),
        unsubscribeMethodFromGroup: jest.fn(),
        signalR: { connectionState: "Connected" },
        isReconnected: true,
        sendMessage,
    }));
    renderHook(() => useStampMediaExhibits(), { wrapper: customWrapper });
    expect(state.dispatch).toHaveBeenCalledWith(actions.setStampLabel(stampLabel));
});

test("should show a Message component when receive a Notification type error", () => {
    const deps = getMockDeps();
    const customWrapper = ({ children }) => defineProviderValues({}, state.dispatch, deps, children);
    const sendMessage = jest.fn();
    useSignalR.mockImplementation(() => ({
        subscribeToGroup: jest.fn((url, callback) => callback(stampNotificationMessageWithError)),
        unsubscribeMethodFromGroup: jest.fn(),
        signalR: { connectionState: "Connected" },
        isReconnected: true,
        sendMessage,
    }));
    renderHook(() => useStampMediaExhibits(), { wrapper: customWrapper });
    expect(Message).toHaveBeenCalledWith({
        content: "Error",
        type: "error",
        duration: 3,
    });
});
