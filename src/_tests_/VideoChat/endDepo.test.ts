import { renderHook, act } from "@testing-library/react-hooks";
import state from "../mocks/state";
import dataTrackMock from "../mocks/dataTrack";
import wrapper from "../mocks/wrapper";
import { END_DEPO_DATATRACK_MESSAGE } from "../constants/videoChat";
import useEndDepo from "../../hooks/VideoChat/useEndDepo";

test("endDepo hook calls dataTrack with proper params", () => {
    const disconnect = jest.fn();
    const { result } = renderHook(() => useEndDepo(disconnect), { wrapper });
    act(() => {
        result.current.setEndDepo(true);
    });
    expect(dataTrackMock.send).toBeCalledWith(END_DEPO_DATATRACK_MESSAGE);
});

test("endDepo hook calls disconnect with proper params", () => {
    const disconnect = jest.fn();
    const { result } = renderHook(() => useEndDepo(disconnect), { wrapper });
    act(() => {
        result.current.setEndDepo(true);
    });
    expect(disconnect).toBeCalledWith(state.state.room.currentRoom, state.dispatch, true);
});
