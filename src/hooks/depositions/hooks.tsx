import React, { useContext } from "react";
import { useParams } from "react-router";
import { DEPOSITIONS_COUNT_PER_PAGE } from "../../constants/depositions";
import { DepositionModel } from "../../models";
import { IDeposition } from "../../models/deposition";
import actions from "../../state/Depositions/DepositionsListActions";
import { GlobalStateContext } from "../../state/GlobalState";
import useAsyncCallback from "../useAsyncCallback";

export const useScheduleDepositions = () => {
    const { deps } = React.useContext(GlobalStateContext);

    return useAsyncCallback(async ({ depositionList, files, caseId }) => {
        const depositionCreated = await deps.apiService.createDepositions({ depositionList, files, caseId });
        return depositionCreated;
    }, []);
};

export const useFetchDeposition = () => {
    const { depositionID } = useParams<{ depositionID: string }>();
    const { deps } = React.useContext(GlobalStateContext);
    const [fetchDeposition, loading, error, data] = useAsyncCallback<
        any,
        DepositionModel.IDeposition,
        () => Promise<DepositionModel.IDeposition>
    >(() => {
        return deps.apiService.fetchDeposition(depositionID);
    }, []);
    React.useEffect(() => {
        if (error) console.error("Error fetching deposition.");
    }, [error]);
    return { fetchDeposition, loading, deposition: data, error };
};

export const useFetchDepositions = () => {
    const { state, dispatch } = useContext(GlobalStateContext);
    const { sorting, pageNumber, filter } = state.depositionsList;

    const { deps } = React.useContext(GlobalStateContext);
    const [fetchDepositions, loading, error, data] = useAsyncCallback<
        any,
        { depositions: IDeposition[]; totalPast: number; totalUpcoming: number; page: number; numberOfPages: number }
    >(async (payload) => {
        const response: IDeposition[] = await deps.apiService.fetchDepositions({
            pageSize: DEPOSITIONS_COUNT_PER_PAGE,
            page: pageNumber,
            ...payload,
        });
        return response;
    }, []);

    const handleListChange = React.useCallback(
        (pagination, currentFilter = undefined, sorter = undefined) => {
            const page = pagination?.current;
            const newFilter = { ...filter, ...currentFilter };

            if (currentFilter) {
                dispatch(actions.setFilter(newFilter));
            }

            let sortParams = {};
            if (sorter) {
                dispatch(actions.setSorting(sorter));
                sortParams = !sorter?.order
                    ? {}
                    : {
                          sortedField: sorter?.field,
                          sortDirection: sorter?.order,
                      };
            }

            if (page) {
                dispatch(actions.setPageNumber(page));
            }

            const pageParams = { page: page ?? pageNumber };

            fetchDepositions({
                ...sortParams,
                ...newFilter,
                ...pageParams,
            });
        },
        [fetchDepositions, pageNumber, filter, dispatch]
    );

    const refreshList = React.useCallback(() => {
        handleListChange(null, null, {});
    }, [handleListChange]);

    React.useEffect(() => {
        handleListChange({ current: pageNumber }, filter, sorting);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return React.useMemo(
        () => ({
            handleListChange,
            sortedField: sorting?.field,
            sortDirection: sorting?.order,
            error,
            depositions: data?.depositions,
            totalPast: data?.totalPast,
            totalUpcoming: data?.totalUpcoming,
            page: data?.page || 1,
            numberOfPages: data?.numberOfPages,
            loading,
            refreshList,
            filter,
        }),
        [data, error, handleListChange, loading, refreshList, sorting, filter]
    );
};
