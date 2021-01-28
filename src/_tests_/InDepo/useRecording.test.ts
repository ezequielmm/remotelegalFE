import { renderHook } from "@testing-library/react-hooks";
import wrapper from "../mocks/wrapper";
import useRecording from "../../hooks/InDepo/useRecording";
import state from "../mocks/state";
import actions from "../../state/InDepo/InDepoActions";
import * as CONSTANTS from "../mocks/transcription";
import { defineProviderValues } from "../../state/GlobalState";
import getMockDeps from "../utils/getMockDeps";

jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useParams: () => ({
        useParams: jest.fn(),
    }),
}));

test("It calls setIsRecording with true after the API service responds and the dataTrack with the right JSON", async () => {
    const { result, waitForNextUpdate } = renderHook(() => useRecording(true), { wrapper });
    result.current();
    await waitForNextUpdate();
    expect(state.dispatch).toHaveBeenCalledWith(actions.setIsRecording(true));
    expect(state.state.room.dataTrack.send).toHaveBeenCalledWith(
        JSON.stringify({ module: "recordDepo", value: CONSTANTS.getRecordResponse(true) })
    );
});

test("It calls setIsRecording with false after the API service responds and the dataTrack with the right JSON", async () => {
    const deps = getMockDeps();
    deps.apiService.recordDeposition = jest.fn().mockResolvedValue(CONSTANTS.getRecordResponse(false));
    const customWrapper = ({ children }) => defineProviderValues(state.state, state.dispatch, deps, children);
    const { result, waitForNextUpdate } = renderHook(() => useRecording(false), { wrapper: customWrapper });
    result.current();
    await waitForNextUpdate();
    expect(state.dispatch).toHaveBeenCalledWith(actions.setIsRecording(false));
    expect(state.state.room.dataTrack.send).toHaveBeenCalledWith(
        JSON.stringify({ module: "recordDepo", value: CONSTANTS.getRecordResponse(false) })
    );
});
