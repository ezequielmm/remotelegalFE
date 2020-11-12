import React from "react";
import buildRequestOptions from "../../helpers/buildRequestOptions";
import useFetch from "../useFetch";

export const useCreateCase = () => {
    const requestObj = buildRequestOptions("POST");
    const { error, data, loading, fetchAPI, setData } = useFetch(
        `${process.env.REACT_APP_BASE_BE_URL}/api/Cases`,
        requestObj
    );

    const createCase = (caseNameValue, caseNumber) => {
        const body = JSON.stringify({
            name: caseNameValue,
            caseNumber,
        });
        fetchAPI({ extraOptions: { body } });
    };

    return { createCase, error, data, loading, setData };
};

export const useFetchCase = () => {
    const requestObj = buildRequestOptions("GET");
    const [sortedField, setSortedField] = React.useState(undefined);
    const [sortDirection, setSortDirection] = React.useState(undefined);

    const { error, data, loading, fetchAPI } = useFetch(
        `${process.env.REACT_APP_BASE_BE_URL}/api/Cases`,
        requestObj,
        true
    );

    const handleListChange = React.useCallback(
        (pag, filter, sorter) => {
            const newSortedField = sorter.field;
            const newSortDirection = sorter.order;
            setSortedField(newSortedField);
            setSortDirection(newSortDirection);
            const urlParams =
                newSortDirection === undefined ? {} : { sortedField: newSortedField, sortDirection: newSortDirection };
            fetchAPI({ urlParams });
        },
        [fetchAPI]
    );

    const refreshList = React.useCallback(() => {
        handleListChange(null, null, {});
    }, [handleListChange]);

    React.useEffect(() => {
        fetchAPI();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { handleListChange, sortedField, sortDirection, error, data, loading, refreshList };
};
