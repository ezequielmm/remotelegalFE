import { useCallback, useContext, useEffect, useState, Key } from "react";
import { TablePaginationConfig } from "antd/lib/table";
import uploadFile from "../../services/UploadService";
import { GlobalStateContext } from "../../state/GlobalState";
import { ExhibitFile } from "../../types/ExhibitFile";
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

export const useFileList = (
    depositionID: string
): {
    handleFetchFiles: (
        pagination: TablePaginationConfig,
        filters: Record<string, Key[] | null>,
        sorter: Record<string, any>
    ) => void;
    loading: boolean;
    errorFetchFiles;
    files: ExhibitFile[];
    sortDirection;
    sortedField;
    refreshList;
} => {
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

export const useSignedUrl = (documentId: string) => {
    const { deps } = useContext(GlobalStateContext);

    const [getURL, pending, error, documentUrl] = useAsyncCallback(async (payload) => {
        const depositionFiles = await deps.apiService.getDocumentUrl({ documentId, ...payload });
        return depositionFiles;
    }, []);
    useEffect(() => {
        getURL();
    }, [getURL]);

    return { getURL, pending, error, documentUrl };
};
