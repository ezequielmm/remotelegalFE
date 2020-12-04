import { renderHook, act } from "@testing-library/react-hooks";
import dataTrackMock from "../mocks/dataTrack";
import wrapper from "../mocks/wrapper";
import { END_DEPO_DATATRACK_MESSAGE } from "../constants/InDepo";
import useEndDepo from "../../hooks/InDepo/useEndDepo";
import disconnectFromDepo from "../../helpers/disconnectFromDepo";

jest.mock("../../helpers/disconnectFromDepo", () => ({
    __esModule: true, // this property makes it work
    default: jest.fn(),
}));

test("endDepo hook calls dataTrack with proper params", () => {
    const { result } = renderHook(() => useEndDepo(), { wrapper });
    act(() => {
        result.current.setEndDepo(true);
    });
    expect(dataTrackMock.send).toBeCalledWith(END_DEPO_DATATRACK_MESSAGE);
});

test("endDepo hook calls disconnect with proper params", () => {
    const { result } = renderHook(() => useEndDepo(), { wrapper });
    act(() => {
        result.current.setEndDepo(true);
    });
    expect(disconnectFromDepo).toBeCalled();
});
