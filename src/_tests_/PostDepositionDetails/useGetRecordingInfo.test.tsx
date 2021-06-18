import { act, renderHook } from "@testing-library/react-hooks";
import state from "../mocks/state";
import { defineProviderValues } from "../../state/GlobalState";
import getMockDeps from "../utils/getMockDeps";
import { useGetRecordingInfo } from "../../hooks/useGetRecordingInfo";

jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useParams: () => ({
        useParams: jest.fn(),
        depositionID: "depositionIDXXXX",
    }),
}));

let deps;
beforeEach(() => {
    deps = getMockDeps();
});

describe("useGetRecordingInfo", () => {
    test("recordingInfo data should not be null when getRecordingInfo get any record info data", async () => {
        deps.apiService.getRecordingInfo = jest.fn().mockResolvedValue({
            totalTime: 0,
            onTheRecordTime: 0,
            offTheRecordTime: 120,
            publicUrl: "url",
        });
        const customWrapper = ({ children }) => defineProviderValues(state.state, state.dispatch, deps, children);
        const { result, waitForNextUpdate } = renderHook(() => useGetRecordingInfo(), { wrapper: customWrapper });
        act(() => {
            result.current.getRecordingInfo();
        });
        await waitForNextUpdate();

        expect(result.current.recordingInfo).not.toBeNull();
        expect(result.current.pendingGetRecordingInfo).not.toBeTruthy();
        expect(result.current.recordingInfo.publicUrl).toBe("url");
    });

    test("errorRecordingInfo should be not null if getRecordingInfo return an error", async () => {
        deps.apiService.getRecordingInfo = jest.fn().mockRejectedValue(false);
        const customWrapper = ({ children }) => defineProviderValues(state.state, state.dispatch, deps, children);
        const { result, waitForNextUpdate } = renderHook(() => useGetRecordingInfo(), { wrapper: customWrapper });
        act(() => {
            result.current.getRecordingInfo();
        });
        await waitForNextUpdate();
        expect(result.current.errorRecordingInfo).not.toBeNull();
    });
});
