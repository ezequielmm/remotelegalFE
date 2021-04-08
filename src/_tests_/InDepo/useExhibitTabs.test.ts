import { renderHook } from "@testing-library/react-hooks";
import wrapper from "../mocks/wrapper";
import useRecording from "../../hooks/InDepo/useRecording";
import state from "../mocks/state";
import actions from "../../state/InDepo/InDepoActions";
import { defineProviderValues } from "../../state/GlobalState";
import getMockDeps from "../utils/getMockDeps";
import { wait } from "../../helpers/wait";
import { useExhibitTabs } from "../../hooks/exhibits/hooks";
import * as CONSTANTS from "../../constants/exhibits";
import { currentExhibit } from "../mocks/currentExhibit";

jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useParams: () => ({
        useParams: jest.fn(),
    }),
}));

describe("useExhibitTabs", () => {
    test("should highlight key distinct to -1 only when is on the live exhibit tab and has a shared exhibit", async () => {
        const deps = getMockDeps();
        const currentRoomStateMock = {
            room: {
                ...state.state.room,
                currentExhibit,
            },
        };

        const customWrapper = ({ children }) =>
            defineProviderValues(currentRoomStateMock, state.dispatch, deps, children);
        const { result } = renderHook(() => useExhibitTabs(), { wrapper: customWrapper });
        expect(result.current.highlightKey).toEqual(
            CONSTANTS.EXHIBIT_TABS_DATA.findIndex((tab) => tab.tabId === CONSTANTS.EXHIBIT_TABS.liveExhibits)
        );
    });
    test("should highlight key equal to -1 when has not a shared exhibit", async () => {
        const deps = getMockDeps();
        const customWrapper = ({ children }) => defineProviderValues(state.state, state.dispatch, deps, children);
        const { result } = renderHook(() => useExhibitTabs(), { wrapper: customWrapper });
        expect(result.current.highlightKey).toEqual(-1);
    });
    test("should set the active key to live exhibit when the highlight key is different to -1 and has a shared exhibit", async () => {
        const deps = getMockDeps();
        const currentRoomStateMock = {
            room: {
                ...state.state.room,
                currentExhibit,
                currentExhibitPage: "1",
            },
        };

        const customWrapper = ({ children }) =>
            defineProviderValues(currentRoomStateMock, state.dispatch, deps, children);
        const { result } = renderHook(() => useExhibitTabs(), { wrapper: customWrapper });
        expect(state.dispatch).toHaveBeenCalledWith(actions.setActiveTab(CONSTANTS.LIVE_EXHIBIT_TAB));
    });
    test("should not set the active key to live exhibit when the highlight key is equal to -1 or has not a shared exhibit", async () => {
        const deps = getMockDeps();
        const customWrapper = ({ children }) => defineProviderValues(state.state, state.dispatch, deps, children);
        const { result } = renderHook(() => useExhibitTabs(), { wrapper: customWrapper });
        expect(result.current.activeKey).toEqual(CONSTANTS.DEFAULT_ACTIVE_TAB);
    });
    test("should highlight key distinct to -1 only when received a data track message that has a shared exhibit", async () => {
        const deps = getMockDeps();
        const currentRoomStateMock = {
            room: {
                ...state.state.room,
                currentExhibit,
                message: {
                    value: true,
                },
            },
        };

        const customWrapper = ({ children }) =>
            defineProviderValues(currentRoomStateMock, state.dispatch, deps, children);
        const { result } = renderHook(() => useExhibitTabs(), { wrapper: customWrapper });
        expect(result.current.highlightKey).toEqual(
            CONSTANTS.EXHIBIT_TABS_DATA.findIndex((tab) => tab.tabId === CONSTANTS.EXHIBIT_TABS.liveExhibits)
        );
    });
});
