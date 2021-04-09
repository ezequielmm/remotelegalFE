import { useContext, useEffect, useCallback, useState, Key } from "react";
import { useParams } from "react-router";
import { TablePaginationConfig } from "antd/lib/table";
import { SortOrder } from "antd/lib/table/interface";
import { GlobalStateContext } from "../../state/GlobalState";
import { TranscriptFile } from "../../types/TranscriptFile";
import useAsyncCallback from "../useAsyncCallback";
import uploadFile from "../../services/UploadService";
import { ITranscripstUrlList } from "../../models/transcriptFile";

interface HandleFetchFilesSorterType {
    field?: Key | Key[];
    order?: SortOrder;
}

export const useTranscriptFileList = (
    depositionID: string
): {
    handleFetchFiles: (
        pagination?: TablePaginationConfig,
        filters?: Record<string, Key[] | null>,
        sorter?: HandleFetchFilesSorterType
    ) => void;
    loading: boolean;
    errorFetchFiles: any;
    transcriptFileList: TranscriptFile[];
    sortDirection: any;
    sortedField: any;
    refreshList: any;
} => {
    const [sortedField, setSortedField] = useState();
    const [sortDirection, setSortDirection] = useState();
    const { deps } = useContext(GlobalStateContext);

    const [fetchFiles, loading, errorFetchFiles, transcriptFileList] = useAsyncCallback(async (payload) => {
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

    return { handleFetchFiles, loading, errorFetchFiles, transcriptFileList, sortDirection, sortedField, refreshList };
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

export const useGetSignedUrl = (): {
    getSignedUrl: (documentID: string) => void;
    privateSignedUrlPending: boolean;
    privateSignedUrlError: any;
    documentData: any;
} => {
    const { deps } = useContext(GlobalStateContext);
    const { depositionID } = useParams<{ depositionID: string }>();

    const [getSignedUrl, privateSignedUrlPending, privateSignedUrlError, documentData] = useAsyncCallback(
        async (documentId) => {
            const roughTranscript = await deps.apiService.getSignedUrl({ depositionID, documentId });
            return { ...roughTranscript, documentId };
        },
        []
    );

    return { getSignedUrl, privateSignedUrlPending, privateSignedUrlError, documentData };
};

export const useGetDocumentsUrlList = (): {
    getDocumentsUrlList: (documentIds: string[]) => void;
    documentsUrlList: ITranscripstUrlList;
    pendingGetTranscriptsUrlList: boolean;
    errorGetTranscriptsUrlList: any;
} => {
    const { deps } = useContext(GlobalStateContext);
    const { depositionID } = useParams<{ depositionID: string }>();

    const [
        getDocumentsUrlList,
        pendingGetTranscriptsUrlList,
        errorGetTranscriptsUrlList,
        documentsUrlList,
    ] = useAsyncCallback(async (documentIds) => deps.apiService.getDocumentsUrlList({ depositionID, documentIds }), []);

    return {
        getDocumentsUrlList,
        documentsUrlList,
        pendingGetTranscriptsUrlList,
        errorGetTranscriptsUrlList,
    };
};

export const useRemoveTranscript = () => {
    const { deps } = useContext(GlobalStateContext);
    return useAsyncCallback<any, any>(async (depoID, transcriptID) => {
        const response = await deps.apiService.removeTranscript(depoID, transcriptID);
        return response;
    }, []);
};

export const useNotifyParties = () => {
    const { deps } = useContext(GlobalStateContext);
    return useAsyncCallback<any, any>(async (depoID) => {
        const response = await deps.apiService.notifyParties(depoID);
        return response;
    }, []);
};
