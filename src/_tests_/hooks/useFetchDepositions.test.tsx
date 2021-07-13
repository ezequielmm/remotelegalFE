import { renderHook, act } from "@testing-library/react-hooks";
import state from "../mocks/state";
import getMockDeps from "../utils/getMockDeps";
import { defineProviderValues } from "../../state/GlobalState";
import { useFetchDepositions } from "../../hooks/depositions/hooks";
import actions from "../../state/Depositions/DepositionsListActions";

beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
});

test("should call fetchDepositions after mount the hook", async () => {
    const deps = getMockDeps();
    const depositionsListMock = {
        depositionsList: {
            pageNumber: 1,
        },
    };

    const customWrapper = ({ children }) => defineProviderValues(depositionsListMock, state.dispatch, deps, children);
    renderHook(() => useFetchDepositions(), { wrapper: customWrapper });
    await act(async () => {
        expect(deps.apiService.fetchDepositions).toBeCalledWith({ page: 1, pageSize: 20 });
    });
});

test("should call fetchDepositions with page 2", async () => {
    const deps = getMockDeps();
    const depositionsListMock = {
        depositionsList: {
            pageNumber: 1,
        },
    };

    const customWrapper = ({ children }) => defineProviderValues(depositionsListMock, state.dispatch, deps, children);
    const { result } = renderHook(() => useFetchDepositions(), { wrapper: customWrapper });
    await act(async () => {
        result.current.handleListChange({ current: 2 });
        expect(deps.apiService.fetchDepositions).toBeCalledWith({ page: 2, pageSize: 20 });
    });
});

test("should call fetchDepositions with a new sorting info", async () => {
    const deps = getMockDeps();
    const depositionsListMock = {
        depositionsList: {
            pageNumber: 1,
        },
    };

    const customWrapper = ({ children }) => defineProviderValues(depositionsListMock, state.dispatch, deps, children);
    const { result } = renderHook(() => useFetchDepositions(), { wrapper: customWrapper });
    await act(async () => {
        result.current.handleListChange({ current: 2 }, null, { field: "status", order: "descend" });
        expect(deps.apiService.fetchDepositions).toBeCalledWith({
            page: 2,
            sortedField: "status",
            sortDirection: "descend",
            pageSize: 20,
        });
    });
    expect(state.dispatch).toHaveBeenCalledWith(actions.setSorting({ field: "status", order: "descend" }));
});

test("should call fetchDepositions with a new sorting info from store", async () => {
    const deps = getMockDeps();
    const depositionsListMock = {
        depositionsList: {
            pageNumber: 1,
            sorting: { field: "status", order: "descend" },
        },
    };

    const customWrapper = ({ children }) => defineProviderValues(depositionsListMock, state.dispatch, deps, children);
    const { result } = renderHook(() => useFetchDepositions(), { wrapper: customWrapper });
    await act(async () => {
        expect(deps.apiService.fetchDepositions).toHaveBeenLastCalledWith({
            page: 1,
            sortedField: "status",
            sortDirection: "descend",
            pageSize: 20,
        });
    });
    expect(result.current.sortedField).toEqual("status");
    expect(result.current.sortDirection).toEqual("descend");
});

test("should call fetchDepositions with a new filter PastDepositions on true", async () => {
    const deps = getMockDeps();
    const depositionsListMock = {
        depositionsList: {
            pageNumber: 1,
        },
    };

    const customWrapper = ({ children }) => defineProviderValues(depositionsListMock, state.dispatch, deps, children);
    const { result } = renderHook(() => useFetchDepositions(), { wrapper: customWrapper });
    await act(async () => {
        result.current.handleListChange({ current: 2 }, { PastDepositions: true });
        expect(deps.apiService.fetchDepositions).toBeCalledWith({
            page: 2,
            PastDepositions: true,
            pageSize: 20,
        });
    });
    expect(state.dispatch).toHaveBeenCalledWith(actions.setFilter({ PastDepositions: true }));
});

test("should call fetchDepositions with a changed filter PastDepositions to false", async () => {
    const deps = getMockDeps();
    const depositionsListMock = {
        depositionsList: {
            pageNumber: 1,
            filter: {
                PastDepositions: true,
            },
        },
    };

    const customWrapper = ({ children }) => defineProviderValues(depositionsListMock, state.dispatch, deps, children);
    const { result } = renderHook(() => useFetchDepositions(), { wrapper: customWrapper });
    await act(async () => {
        result.current.handleListChange({ current: 2 }, { PastDepositions: false });
        expect(deps.apiService.fetchDepositions).toBeCalledWith({
            page: 2,
            PastDepositions: false,
            pageSize: 20,
        });
    });
    expect(state.dispatch).toHaveBeenCalledWith(actions.setFilter({ PastDepositions: false }));
});

test("should call fetchDepositions with a filter PastDepositions from the store", async () => {
    const deps = getMockDeps();
    const depositionsListMock = {
        depositionsList: {
            pageNumber: 1,
            filter: {
                PastDepositions: true,
            },
        },
    };

    const customWrapper = ({ children }) => defineProviderValues(depositionsListMock, state.dispatch, deps, children);
    renderHook(() => useFetchDepositions(), { wrapper: customWrapper });
    await act(async () => {
        expect(deps.apiService.fetchDepositions).toBeCalledWith({
            page: 1,
            PastDepositions: true,
            pageSize: 20,
        });
    });
    expect(state.dispatch).toHaveBeenCalledWith(actions.setFilter({ PastDepositions: true }));
});

test("should call fetchDepositions with a filter PastDepositions from the store and also MinDate and MaxDate filters", async () => {
    const deps = getMockDeps();
    const depositionsListMock = {
        depositionsList: {
            pageNumber: 1,
            filter: {
                PastDepositions: true,
            },
        },
    };

    const customWrapper = ({ children }) => defineProviderValues(depositionsListMock, state.dispatch, deps, children);
    const { result } = renderHook(() => useFetchDepositions(), { wrapper: customWrapper });
    await act(async () => {
        result.current.handleListChange({ current: 2 }, { MinDate: "min-date", MaxDate: "max-date" });
        expect(deps.apiService.fetchDepositions).toHaveBeenNthCalledWith(1, {
            page: 1,
            PastDepositions: true,
            pageSize: 20,
        });
        expect(deps.apiService.fetchDepositions).toHaveBeenNthCalledWith(2, {
            page: 2,
            MinDate: "min-date",
            MaxDate: "max-date",
            PastDepositions: true,
            pageSize: 20,
        });
    });
    expect(state.dispatch).toHaveBeenCalledWith(
        actions.setFilter({ PastDepositions: true, MinDate: "min-date", MaxDate: "max-date" })
    );
});
