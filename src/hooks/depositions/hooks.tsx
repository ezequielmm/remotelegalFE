import React from "react";
import { useParams } from "react-router";
import { DepositionModel } from "../../models";
import { IDeposition } from "../../models/deposition";
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
    const [sortedField, setSortedField] = React.useState();
    const [sortDirection, setSortDirection] = React.useState();

    const { deps } = React.useContext(GlobalStateContext);
    const [fetchDepositions, loading, error, data] = useAsyncCallback<
        any,
        { depositions: IDeposition[]; totalPast: number; totalUpcoming: number }
    >(async (payload) => {
        const response: IDeposition[] = await deps.apiService.fetchDepositions(payload);
        return response;
    }, []);

    const handleListChange = React.useCallback(
        (pag, filter = undefined, sorter = undefined) => {
            const newSortedField = sorter?.field;
            const newSortDirection = sorter?.order;
            setSortedField(newSortedField);
            setSortDirection(newSortDirection);
            const sortParams =
                newSortDirection === undefined ? {} : { sortedField: newSortedField, sortDirection: newSortDirection };
            fetchDepositions({ ...sortParams, ...filter });
        },
        [fetchDepositions]
    );

    const refreshList = React.useCallback(() => {
        handleListChange(null, null, {});
    }, [handleListChange]);

    React.useEffect(() => {
        fetchDepositions({});
    }, [fetchDepositions]);

    return React.useMemo(
        () => ({
            handleListChange,
            sortedField,
            sortDirection,
            error,
            depositions: data?.depositions,
            totalPast: data?.totalPast,
            totalUpcoming: data?.totalUpcoming,
            loading,
            refreshList,
        }),
        [data, error, handleListChange, loading, refreshList, sortDirection, sortedField]
    );
};
