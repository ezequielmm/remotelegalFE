import { renderHook } from "@testing-library/react-hooks";
import wrapper from "../mocks/wrapper";
import useRecording from "../../hooks/InDepo/useRecording";
import state from "../mocks/state";

jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useParams: () => ({
        useParams: jest.fn(),
    }),
}));

test("It calls toggleRecord with true after the API service responds and the dataTrack with the right JSON", async () => {
    const toggleRecord = jest.fn();
    const { result, waitForNextUpdate } = renderHook(() => useRecording(true, toggleRecord), { wrapper });
    result.current();
    await waitForNextUpdate();
    expect(toggleRecord).toHaveBeenCalledWith(true);
    expect(state.state.room.dataTrack.send).toHaveBeenCalledWith(JSON.stringify({ module: "recordDepo", value: true }));
});

test("It calls toggleRecord with false after the API service responds and the dataTrack with the right JSON", async () => {
    const toggleRecord = jest.fn();
    const { result, waitForNextUpdate } = renderHook(() => useRecording(false, toggleRecord), { wrapper });
    result.current();
    await waitForNextUpdate();
    expect(toggleRecord).toHaveBeenCalledWith(false);
    expect(state.state.room.dataTrack.send).toHaveBeenCalledWith(
        JSON.stringify({ module: "recordDepo", value: false })
    );
});
