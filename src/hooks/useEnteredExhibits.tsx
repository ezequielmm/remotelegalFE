import { Key, useCallback, useContext } from "react";
import { TablePaginationConfig } from "antd/lib/table";
import { SortOrder } from "antd/lib/table/interface";
import { useParams } from "react-router";
import { GlobalStateContext } from "../state/GlobalState";
import useAsyncCallback from "./useAsyncCallback";

interface HandleFetchFilesSorterType {
    field?: Key | Key[];
    order?: SortOrder;
}

export const useEnteredExhibit = (): {
    handleFetchFiles: (
        pagination?: TablePaginationConfig,
        filters?: Record<string, Key[] | null>,
        sorter?: HandleFetchFilesSorterType
    ) => void;
    enteredExhibitsPending: boolean;
    enteredExhibitsError;
    enteredExhibits;
} => {
    const { deps } = useContext(GlobalStateContext);
    const { depositionID } = useParams<{ depositionID: string }>();
    const [getEnteredExhibits, enteredExhibitsPending, enteredExhibitsError, enteredExhibits] = useAsyncCallback(
        async (payload) => {
            const exhibits = await deps.apiService.getEnteredExhibits({ depositionID, ...payload });
            return exhibits;
        },
        []
    );

    const handleFetchFiles = useCallback(
        // eslint-disable-next-line consistent-return
        (pagination, filters, sorter) => {
            if (!sorter) return getEnteredExhibits({});
            const enteredExhibitsSortedFields = {
                addedBy: "owner",
                displayName: "name",
            };
            const newSortedField = enteredExhibitsSortedFields[sorter.field] ?? sorter.field;
            const newSortDirection = sorter.order;
            const urlParams =
                newSortDirection === undefined ? {} : { sortedField: newSortedField, sortDirection: newSortDirection };
            getEnteredExhibits(urlParams);
        },
        [getEnteredExhibits]
    );
    return { handleFetchFiles, enteredExhibitsPending, enteredExhibitsError, enteredExhibits };
};

export default useEnteredExhibit;
