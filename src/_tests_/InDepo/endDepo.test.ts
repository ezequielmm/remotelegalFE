import { renderHook, act } from "@testing-library/react-hooks";
import useEndDepo from "../../hooks/InDepo/useEndDepo";
import state from "../mocks/state";
import { defineProviderValues } from "../../state/GlobalState";
import getMockDeps from "../utils/getMockDeps";
import Message from "../../components/Message";
import { NETWORK_ERROR } from "../constants/InDepo";

jest.mock("../../components/Message", () => ({
    __esModule: true,
    default: jest.fn(),
}));

const { dispatch } = state;
const mockDeps = getMockDeps();
mockDeps.apiService.endDeposition = jest.fn();
const overridenWrapper = ({ children }) => defineProviderValues(state.state, dispatch, mockDeps, children);

jest.mock("audio-recorder-polyfill", () => {
    return jest.fn().mockImplementation(() => ({
        start: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        stop: jest.fn(),
        stream: { getTracks: () => [{ stop: () => {} }] },
    }));
});

(global.navigator as any).mediaDevices = {
    getUserMedia: jest.fn().mockResolvedValue(true),
};

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

test("endDepo hook calls killDepo endpoint", () => {
    const { result } = renderHook(() => useEndDepo(), { wrapper: overridenWrapper });
    act(() => {
        result.current.setEndDepo(true);
    });
    expect(mockDeps.apiService.endDeposition).toHaveBeenCalled();
});

test("endDepo hook shows toast if fetch fails", () => {
    mockDeps.apiService.endDeposition = jest.fn().mockRejectedValue(new Error("error"));
    const { result, waitFor } = renderHook(() => useEndDepo(), { wrapper: overridenWrapper });
    act(() => {
        result.current.setEndDepo(true);
    });
    waitFor(() =>
        expect(Message).toHaveBeenCalledWith({
            content: NETWORK_ERROR,
            type: "error",
            duration: 3,
        })
    );
});
