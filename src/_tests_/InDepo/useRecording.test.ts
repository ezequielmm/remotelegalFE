import { renderHook } from "@testing-library/react-hooks";
import wrapper from "../mocks/wrapper";
import useRecording from "../../hooks/InDepo/useRecording";
import state from "../mocks/state";
import actions from "../../state/InDepo/InDepoActions";

jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useParams: () => ({
        useParams: jest.fn(),
    }),
}));

test("It calls setIsRecoding with true after the API service responds and the dataTrack with the right JSON", async () => {
    const { result, waitForNextUpdate } = renderHook(() => useRecording(true), { wrapper });
    result.current();
    await waitForNextUpdate();
    expect(state.dispatch).toHaveBeenCalledWith(actions.setIsRecoding(true));
    expect(state.state.room.dataTrack.send).toHaveBeenCalledWith(JSON.stringify({ module: "recordDepo", value: true }));
});

test("It calls setIsRecoding with false after the API service responds and the dataTrack with the right JSON", async () => {
    const { result, waitForNextUpdate } = renderHook(() => useRecording(false), { wrapper });
    result.current();
    await waitForNextUpdate();
    expect(state.dispatch).toHaveBeenCalledWith(actions.setIsRecoding(false));
    expect(state.state.room.dataTrack.send).toHaveBeenCalledWith(
        JSON.stringify({ module: "recordDepo", value: false })
    );
});
