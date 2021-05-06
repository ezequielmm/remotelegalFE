import React from "react";
import { useParams } from "react-router";
import { DEPOSITIONS_COUNT_PER_PAGE } from "../../constants/depositions";
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
    const [pageNumber, setPageNumber] = React.useState(1);
    const [currentFilter, setCurrentFilter] = React.useState({});

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
        (pagination, filter = undefined, sorter = undefined) => {
            const page = pagination?.current;
            const newFilter = { ...currentFilter, ...filter };
            if (filter) {
                setCurrentFilter(newFilter);
            }

            setSortedField(sorter?.field || undefined);
            setSortDirection(sorter?.order || undefined);

            if (page) {
                setPageNumber(page);
            }

            const sortParams = !sorter?.order
                ? {}
                : {
                      sortedField: sorter?.field,
                      sortDirection: sorter?.order,
                  };
            const pageParams = { page: page ?? pageNumber };

            fetchDepositions({
                ...sortParams,
                ...newFilter,
                ...pageParams,
            });
        },
        [fetchDepositions, setPageNumber, pageNumber, currentFilter]
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
            page: data?.page || 1,
            numberOfPages: data?.numberOfPages,
            loading,
            refreshList,
        }),
        [data, error, handleListChange, loading, refreshList, sortDirection, sortedField]
    );
};
