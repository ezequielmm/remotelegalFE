import { renderHook, act } from "@testing-library/react-hooks";
import dataTrackMock from "../mocks/dataTrack";
import wrapper from "../mocks/wrapper";
import { END_DEPO_DATATRACK_MESSAGE } from "../constants/InDepo";
import useEndDepo from "../../hooks/InDepo/useEndDepo";

jest.mock("audio-recorder-polyfill", () => {
    return jest.fn().mockImplementation(() => ({
        start: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        stop: jest.fn(),
        stream: { getTracks: () => [{ stop: () => {} }] },
    }));
});

Object.defineProperty(global.navigator, "mediaDevices", {
    get: () => ({
        getUserMedia: jest.fn().mockResolvedValue(true),
    }),
});

jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useParams: () => ({
        useParams: jest.fn(),
    }),
}));

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

test("endDepo hook calls disconnect with proper params", (done) => {
    const { result } = renderHook(() => useEndDepo(), { wrapper });
    act(() => {
        result.current.setEndDepo(true);
    });
    // TODO fix this test
    done();
});
