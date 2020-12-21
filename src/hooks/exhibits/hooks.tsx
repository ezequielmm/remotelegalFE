import { useCallback, useContext, useEffect, useState } from "react";
import uploadFile from "../../services/UploadService";
import { GlobalStateContext } from "../../state/GlobalState";
import useAsyncCallback from "../useAsyncCallback";

export const useUploadFile = (depositionID: string) => {
    const upload = useCallback(
        async ({ onSuccess, onError, file, onProgress }) => {
            uploadFile(
                `/api/Depositions/${depositionID}/exhibits`,
                file,
                (event) => onProgress({ percent: (event.loaded / event.total) * 100 }),
                onSuccess,
                onError
            );
        },
        [depositionID]
    );

    return { upload };
};

export const useFileList = (depositionID: string) => {
    const [sortedField, setSortedField] = useState();
    const [sortDirection, setSortDirection] = useState();
    const { deps } = useContext(GlobalStateContext);

    const [fetchFiles, loading, errorFetchFiles, files] = useAsyncCallback(async (payload) => {
        const depositionFiles = await deps.apiService.fetchDepositionsFiles({ depositionID, ...payload });
        return depositionFiles;
    }, []);

    const handleFetchFiles = useCallback(
        (pagination, filters, sorter) => {
            const newSortedField = sorter.field;
            const newSortDirection = sorter.order;
            setSortedField(newSortedField);
            setSortDirection(newSortDirection);
            const urlParams =
                newSortDirection === undefined ? {} : { sortedField: newSortedField, sortDirection: newSortDirection };
            fetchFiles(urlParams);
        },
        [fetchFiles]
    );

    const refreshList = useCallback(() => {
        fetchFiles({});
    }, [fetchFiles]);

    useEffect(() => {
        fetchFiles({});
    }, [fetchFiles]);

    return { handleFetchFiles, loading, errorFetchFiles, files, sortDirection, sortedField, refreshList };
};
