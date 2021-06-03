import React from "react";
import { GlobalStateContext } from "../../state/GlobalState";
import useAsyncCallback from "../useAsyncCallback";

export const useCreateCase = () => {
    const { deps } = React.useContext(GlobalStateContext);

    return useAsyncCallback(async (name, caseNumber) => {
        const newCase = await deps.apiService.createCase({ name, caseNumber });
        return newCase;
    }, []);
};

export const useEditCase = () => {
    const { deps } = React.useContext(GlobalStateContext);

    return useAsyncCallback(async (id, caseObj) => {
        const editCase = await deps.apiService.editCase({ id, caseObj });
        return editCase;
    }, []);
};

export const useFetchCases = () => {
    const [sortedField, setSortedField] = React.useState();
    const [sortDirection, setSortDirection] = React.useState();

    const { deps } = React.useContext(GlobalStateContext);
    const [fetchCases, loading, error, data] = useAsyncCallback(async (payload) => {
        const response = await deps.apiService.fetchCases(payload);
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
            fetchCases(urlParams);
        },
        [fetchCases]
    );

    const refreshList = React.useCallback(() => {
        handleListChange(null, null, {});
    }, [handleListChange]);

    React.useEffect(() => {
        fetchCases({});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { handleListChange, sortedField, sortDirection, error, data, loading, refreshList };
};
