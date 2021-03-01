import { useContext, useEffect, useCallback, useState, Key } from "react";
import { TablePaginationConfig } from "antd/lib/table";
import { SortOrder } from "antd/lib/table/interface";
import { GlobalStateContext } from "../../state/GlobalState";
import { TranscriptFile } from "../../types/TranscriptFile";
import useAsyncCallback from "../useAsyncCallback";
import uploadFile from "../../services/UploadService";

interface HandleFetchFilesSorterType {
    field?: Key | Key[];
    order?: SortOrder;
}

export const useTranscriptList = (
    depositionID: string
): {
    handleFetchFiles: (
        pagination?: TablePaginationConfig,
        filters?: Record<string, Key[] | null>,
        sorter?: HandleFetchFilesSorterType
    ) => void;
    loading: boolean;
    errorFetchFiles: any;
    files: TranscriptFile[];
    sortDirection: any;
    sortedField: any;
    refreshList: any;
} => {
    const [sortedField, setSortedField] = useState();
    const [sortDirection, setSortDirection] = useState();
    const { deps } = useContext(GlobalStateContext);

    const [fetchFiles, loading, errorFetchFiles, files] = useAsyncCallback(async (payload) => {
        const transcriptsFiles = await deps.apiService.fetchTranscriptsFiles({ depositionID, ...payload });
        return transcriptsFiles.map((file: { id: any }) => ({ key: file.id, ...file }));
    }, []);

    const handleFetchFiles = useCallback(
        // eslint-disable-next-line consistent-return
        (_pagination, _filters, sorter) => {
            if (!sorter) return fetchFiles({});
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

export const useUploadFile = (depositionID: string) => {
    const { deps } = useContext(GlobalStateContext);
    const upload = useCallback(
        async ({ onSuccess, onError, file, onProgress }) => {
            uploadFile(
                `/Transcriptions/${depositionID}/Files`,
                file,
                (event) => onProgress({ percent: (event.loaded / event.total) * 100 }),
                onSuccess,
                onError,
                deps
            );
        },
        [depositionID, deps]
    );

    return { upload };
};
