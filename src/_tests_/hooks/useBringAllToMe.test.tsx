import { renderHook, act } from "@testing-library/react-hooks";
import { useBringAllToMe } from "../../hooks/exhibits/hooks";

import state from "../mocks/state";
import getMockDeps from "../utils/getMockDeps";
import { defineProviderValues } from "../../state/GlobalState";
import { rootReducer } from "../../state/GlobalState";

jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"), // use actual for all non-hook parts
    useParams: () => ({
        depositionID: "depositionIDXXXX",
    }),
}));

test("should not call bringAllToMe by default", () => {
    const deps = getMockDeps();

    const bringAllToMeFn = jest.fn();
    deps.apiService.bringAllToMe = bringAllToMeFn.mockResolvedValue([]);

    const customWrapper = ({ children }) => defineProviderValues(rootReducer, state.dispatch, deps, children);
    const { result } = renderHook(() => useBringAllToMe(), { wrapper: customWrapper });
    expect(bringAllToMeFn).not.toBeCalled();
});

test("should call bringAllToMe function with the default parameter page", () => {
    const deps = getMockDeps();

    const bringAllToMeFn = jest.fn();
    deps.apiService.bringAllToMe = bringAllToMeFn.mockResolvedValue([]);

    const customWrapper = ({ children }) => defineProviderValues(rootReducer, state.dispatch, deps, children);
    const { result } = renderHook(() => useBringAllToMe(), { wrapper: customWrapper });
    act(() => {
        result.current.bringAllToMe();
    });
    expect(bringAllToMeFn).toBeCalledWith({ depositionID: "depositionIDXXXX", page: "1" });
});

test("should call bringAllToMe function with the page parameter different to the default", () => {
    const deps = getMockDeps();

    const bringAllToMeFn = jest.fn();
    deps.apiService.bringAllToMe = bringAllToMeFn.mockResolvedValue([]);

    const customWrapper = ({ children }) => defineProviderValues(rootReducer, state.dispatch, deps, children);
    const { result, rerender } = renderHook(() => useBringAllToMe(), { wrapper: customWrapper });
    act(() => {
        result.current.setBringAllToPage("3");
    });
    rerender();
    act(() => {
        result.current.bringAllToMe();
    });
    expect(bringAllToMeFn).toBeCalledWith({ depositionID: "depositionIDXXXX", page: "3" });
});
