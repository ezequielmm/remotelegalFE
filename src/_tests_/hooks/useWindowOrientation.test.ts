import { renderHook } from "@testing-library/react-hooks";
import wrapper from "../mocks/wrapper";
import useWindowOrientation from "../../hooks/useWindowOrientation";
import ORIENTATION_STATE from "../../types/orientation";

let MockGetMatchMedia;

beforeEach(() => {
    window.matchMedia = jest.fn().mockImplementation(() => MockGetMatchMedia);
});

test("Return portrait if the orentation is portrait", () => {
    MockGetMatchMedia = {
        matches: true,
    };
    const { result } = renderHook(() => useWindowOrientation(), { wrapper });
    expect(window.matchMedia).toHaveBeenCalledWith("(orientation: portrait)");
    expect(result.current).toBe(ORIENTATION_STATE.PORTRAIT);
});

test("Return landscape if the orentation is landscape", () => {
    MockGetMatchMedia = {
        matches: false,
    };
    const { result } = renderHook(() => useWindowOrientation(), { wrapper });
    expect(window.matchMedia).toHaveBeenCalledWith("(orientation: portrait)");
    expect(result.current).toBe(ORIENTATION_STATE.LANDSCAPE);
});
