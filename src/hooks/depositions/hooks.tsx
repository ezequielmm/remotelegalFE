import React from "react";
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
    const { deps } = React.useContext(GlobalStateContext);
    const [fetchDeposition, , error] = useAsyncCallback<
        any,
        DepositionModel.IDeposition,
        (depositionID: string) => Promise<DepositionModel.IDeposition>
    >(async (depositionId) => {
        const depositionCreated = await deps.apiService.fetchDeposition(depositionId);
        return depositionCreated;
    }, []);
    React.useEffect(() => {
        if (error) console.error("Error fetching deposition.");
    }, [error]);
    return fetchDeposition;
};

export const useFetchDepositions = () => {
    const [sortedField, setSortedField] = React.useState();
    const [sortDirection, setSortDirection] = React.useState();

    const { deps } = React.useContext(GlobalStateContext);
    const [fetchDepositions, loading, error, data] = useAsyncCallback<any, IDeposition[]>(async (payload) => {
        const response: IDeposition[] = await deps.apiService.fetchDepositions(payload);
        return response;
    }, []);

    const handleListChange = React.useCallback(
        (pag, filter, sorter) => {
            const newSortedField = sorter.field;
            const newSortDirection = sorter.order;
            setSortedField(newSortedField);
            setSortDirection(newSortDirection);
            const urlParams =
                newSortDirection === undefined ? {} : { sortedField: newSortedField, sortDirection: newSortDirection };
            fetchDepositions(urlParams);
        },
        [fetchDepositions]
    );

    const refreshList = React.useCallback(() => {
        handleListChange(null, null, {});
    }, [handleListChange]);

    React.useEffect(() => {
        fetchDepositions({});
    }, [fetchDepositions]);

    return React.useMemo(() => ({ handleListChange, sortedField, sortDirection, error, data, loading, refreshList }), [
        data,
        error,
        handleListChange,
        loading,
        refreshList,
        sortDirection,
        sortedField,
    ]);
};
