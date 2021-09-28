import React, { useContext } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router";
import { DEPOSITIONS_COUNT_PER_PAGE } from "../../constants/depositions";
import { DepositionModel } from "../../models";
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
        if (error) console.error(`Error fetching deposition ${depositionID}.`);
    }, [error, depositionID]);

    return { fetchDeposition, loading, deposition: data, error };
};

export const useFetchDepositions = () => {
    const { state, dispatch } = useContext(GlobalStateContext);
    const { sorting, pageNumber, filter } = state.depositionsList;
    const { deps } = React.useContext(GlobalStateContext);

    const { data, ...queryResult } = useQuery(
        ["getDepositions", pageNumber, sorting?.field, sorting?.order, filter],
        () => {
            return deps.apiService.fetchDepositions({
                pageSize: DEPOSITIONS_COUNT_PER_PAGE,
                page: pageNumber,
                sortedField: !sorting?.order ? undefined : sorting?.field,
                sortDirection: !sorting?.order ? undefined : sorting?.order,
                ...filter,
            });
        },
        { refetchOnWindowFocus: false }
    );

    const handleListChange = React.useCallback(
        (pagination, currentFilter = undefined, sorter = undefined) => {
            const page = pagination?.current;
            const newFilter = { ...filter, ...currentFilter };

            if (currentFilter) {
                dispatch(actions.setFilter(newFilter));
            }

            if (sorter) {
                dispatch(actions.setSorting(sorter));
            }

            if (page) {
                dispatch(actions.setPageNumber(page));
            }
        },
        [filter, dispatch]
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
            error: queryResult?.error,
            depositions: data?.depositions,
            totalPast: data?.totalPast,
            totalUpcoming: data?.totalUpcoming,
            page: data?.page || 1,
            numberOfPages: data?.numberOfPages,
            loading: queryResult?.isLoading,
            refreshList,
            filter,
        }),
        [data, queryResult, handleListChange, refreshList, sorting, filter]
    );
};
