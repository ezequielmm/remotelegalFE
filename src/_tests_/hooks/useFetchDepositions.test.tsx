import { renderHook, act } from "@testing-library/react-hooks";
import { QueryClient, QueryClientProvider } from "react-query";
import state from "../mocks/state";
import getMockDeps from "../utils/getMockDeps";
import { defineProviderValues } from "../../state/GlobalState";
import { useFetchDepositions } from "../../hooks/depositions/hooks";
import actions from "../../state/Depositions/DepositionsListActions";

const queryClient = new QueryClient();
const customWrapper =
    (mock, deps) =>
    ({ children }) => {
        return (
            <QueryClientProvider client={queryClient}>
                {defineProviderValues(mock, state.dispatch, deps, children)}
            </QueryClientProvider>
        );
    };

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

    renderHook(() => useFetchDepositions(), {
        wrapper: customWrapper(depositionsListMock, deps),
    });
    act(() => {
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

    deps.apiService.fetchDepositions = jest.fn().mockResolvedValue({ page: 2 });

    const { result, waitFor } = renderHook(() => useFetchDepositions(), {
        wrapper: customWrapper(depositionsListMock, deps),
    });

    act(() => {
        result.current.handleListChange({ current: 2 });
    });

    expect(state.dispatch).toHaveBeenCalledWith(actions.setPageNumber(2));

    await waitFor(() => {
        expect(result.current.page).toEqual(2);
    });
});

test("should call fetchDepositions with a new sorting info", async () => {
    const deps = getMockDeps();
    const depositionsListMock = {
        depositionsList: {
            pageNumber: 1,
            sorting: {
                field: "status",
                order: "ascend",
            },
        },
    };

    deps.apiService.fetchDepositions = jest.fn().mockResolvedValue({ page: 2 });

    const { result, waitFor, waitForNextUpdate } = renderHook(() => useFetchDepositions(), {
        wrapper: customWrapper(depositionsListMock, deps),
    });
    act(() => {
        result.current.handleListChange({ current: 2 }, null, { field: "status", order: "descend" });
    });

    await waitForNextUpdate();

    await waitFor(() => {
        setTimeout(() => {
            expect(deps.apiService.fetchDepositions).toBeCalledWith({
                page: 2,
                sortedField: "status",
                sortDirection: "descend",
                pageSize: 20,
            });
            expect(result.current.sortDirection).toEqual("descend");
        }, 300);
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

    const { result, waitFor } = renderHook(() => useFetchDepositions(), {
        wrapper: customWrapper(depositionsListMock, deps),
    });
    act(() => {
        expect(deps.apiService.fetchDepositions).toHaveBeenLastCalledWith({
            page: 1,
            sortedField: "status",
            sortDirection: "descend",
            pageSize: 20,
        });
    });
    await waitFor(() => {
        setTimeout(() => {
            expect(result.current.sortedField).toEqual("status");
            expect(result.current.sortDirection).toEqual("descend");
        }, 100);
    });
});

test("should call fetchDepositions with a new filter PastDepositions on true", async () => {
    const deps = getMockDeps();
    const depositionsListMock = {
        depositionsList: {
            pageNumber: 1,
        },
    };

    const { result, waitFor } = renderHook(() => useFetchDepositions(), {
        wrapper: customWrapper(depositionsListMock, deps),
    });
    act(() => {
        result.current.handleListChange({ current: 2 }, { PastDepositions: true });
    });
    await waitFor(() => {
        setTimeout(() => {
            expect(deps.apiService.fetchDepositions).toBeCalledWith({
                page: 2,
                PastDepositions: true,
                pageSize: 20,
            });
            expect(state.dispatch).toHaveBeenCalledWith(actions.setFilter({ PastDepositions: true }));
        }, 100);
    });
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

    const { result, waitFor } = renderHook(() => useFetchDepositions(), {
        wrapper: customWrapper(depositionsListMock, deps),
    });
    act(() => {
        result.current.handleListChange({ current: 2 }, { PastDepositions: false });
    });
    await waitFor(() => {
        setTimeout(() => {
            expect(deps.apiService.fetchDepositions).toBeCalledWith({
                page: 2,
                PastDepositions: false,
                pageSize: 20,
            });
            expect(state.dispatch).toHaveBeenCalledWith(actions.setFilter({ PastDepositions: false }));
        }, 100);
    });
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

    renderHook(() => useFetchDepositions(), { wrapper: customWrapper(depositionsListMock, deps) });
    act(() => {
        setTimeout(() => {
            expect(deps.apiService.fetchDepositions).toBeCalledWith({
                page: 1,
                PastDepositions: true,
                pageSize: 20,
            });
            expect(state.dispatch).toHaveBeenCalledWith(actions.setFilter({ PastDepositions: true }));
        }, 100);
    });
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
    const { result, waitFor } = renderHook(() => useFetchDepositions(), {
        wrapper: customWrapper(depositionsListMock, deps),
    });
    act(() => {
        result.current.handleListChange({ current: 2 }, { MinDate: "min-date", MaxDate: "max-date" });
    });
    await waitFor(() => {
        setTimeout(() => {
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
            expect(state.dispatch).toHaveBeenCalledWith(
                actions.setFilter({ PastDepositions: true, MinDate: "min-date", MaxDate: "max-date" })
            );
        }, 100);
    });
});
