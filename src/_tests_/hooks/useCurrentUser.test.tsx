import { renderHook, act } from "@testing-library/react-hooks";
import state from "../mocks/state";
import getMockDeps from "../utils/getMockDeps";
import { defineProviderValues } from "../../state/GlobalState";
import { rootReducer } from "../../state/GlobalState";
import useCurrentUser from "../../hooks/useCurrentUser";
import actions from "../../state/User/UserActions";

beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
});

test("should call to current user api and also set the current user state", async () => {
    const deps = getMockDeps();

    const currentUserFn = jest.fn();
    const userMock = { firstName: "Peter", lastName: "O'tool" };
    deps.apiService.currentUser = currentUserFn.mockResolvedValue(userMock);

    const customWrapper = ({ children }) => defineProviderValues(rootReducer, state.dispatch, deps, children);
    const { result } = renderHook(() => useCurrentUser(), { wrapper: customWrapper });
    const [getCurrentUser] = result.current;
    await act(async () => {
        await getCurrentUser();
        expect(state.dispatch).toHaveBeenCalledWith(actions.setCurrentUser(userMock));
        expect(currentUserFn).toBeCalled();
    });
});

test("should not set the current user state when the call fails", async () => {
    const deps = getMockDeps();

    const currentUserFn = jest.fn();
    deps.apiService.currentUser = currentUserFn.mockRejectedValue(async () => {
        throw Error("Something wrong");
    });

    const customWrapper = ({ children }) => defineProviderValues(rootReducer, state.dispatch, deps, children);
    const { result } = renderHook(() => useCurrentUser(), { wrapper: customWrapper });
    const [getCurrentUser] = result.current;
    await act(async () => {
        await getCurrentUser();
        expect(state.dispatch).not.toBeCalled();
        expect(currentUserFn).toBeCalled();
    });
});
