import { useCallback, useContext, useEffect, useState, Key, useMemo } from "react";
import { TablePaginationConfig } from "antd/lib/table";
import { useParams } from "react-router";
import uploadFile from "../../services/UploadService";
import { GlobalStateContext } from "../../state/GlobalState";
import { ExhibitFile } from "../../types/ExhibitFile";
import useAsyncCallback from "../useAsyncCallback";
import * as CONSTANTS from "../../constants/exhibits";
import actions from "../../state/InDepo/InDepoActions";
import { CoreControls } from "@pdftron/webviewer";
import { SortOrder } from "antd/lib/table/interface";
import useSignalR from "../useSignalR";
import { NotificationEntityType } from "../../types/Notification";
interface HandleFetchFilesSorterType {
    field?: Key | Key[];
    order?: SortOrder;
}

export const useUploadFile = (depositionID: string) => {
    const { deps } = useContext(GlobalStateContext);
    const upload = useCallback(
        async ({ onSuccess, onError, file, onProgress }) => {
            uploadFile(
                `/api/Depositions/${depositionID}/exhibits`,
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

export const useFileList = (
    depositionID: string
): {
    handleFetchFiles: (
        pagination?: TablePaginationConfig,
        filters?: Record<string, Key[] | null>,
        sorter?: HandleFetchFilesSorterType
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
        return depositionFiles.map((file) => ({ key: file.id, ...file }));
    }, []);

    const handleFetchFiles = useCallback(
        (pagination, filters, sorter) => {
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

export const useSignedUrl = (file: ExhibitFile, isPublic?: boolean) => {
    const { deps } = useContext(GlobalStateContext);
    const { depositionID } = useParams<{ depositionID: string }>();
    const [documentUrl, setDocumentUrl] = useState(null);
    const [documentIsPublic, setDocumentIsPublic] = useState(null);
    const getURLSigned = isPublic ? deps.apiService.getSignedUrl : deps.apiService.getPrivateSignedUrl;
    const [getURL, , error] = useAsyncCallback(async (payload) => {
        const result = await getURLSigned({ depositionID, documentId: file?.id, ...payload });
        setDocumentUrl(result?.url);
        setDocumentIsPublic(result.isPublic);
        return result;
    }, []);
    useEffect(() => {
        if (file?.preSignedUrl) {
            setDocumentUrl(file?.preSignedUrl);
            setDocumentIsPublic(file.isPublic);
        } else {
            getURL();
        }
    }, [getURL, file]);

    return { error, documentUrl: documentUrl, isPublic: documentIsPublic };
};

export const useExhibitFileInfo = () => {
    const { deps, dispatch } = useContext(GlobalStateContext);
    return useAsyncCallback(async (depositionID) => {
        const exhibitFile = await deps.apiService.getSharedExhibit(depositionID);
        if (exhibitFile) {
            const user = await deps.apiService.currentUser();
            dispatch(actions.setCurrentUser(user));
            dispatch(actions.setSharedExhibit(exhibitFile));
        }
        return exhibitFile;
    }, []);
};

export const useExhibitTabs = () => {
    const { state, dispatch } = useContext(GlobalStateContext);
    const { depositionID } = useParams<{ depositionID: string }>();
    const { currentExhibit, message, currentExhibitPage } = state.room;
    const [highlightKey, setHighlightKey] = useState<number>(-1);
    const [activeKey, setActiveKey] = useState<string>(CONSTANTS.DEFAULT_ACTIVE_TAB);
    const [fetchExhibitFileInfo] = useExhibitFileInfo();

    useEffect(() => {
        setHighlightKey(
            CONSTANTS.EXHIBIT_TABS_DATA.findIndex((tab) => tab.tabId === CONSTANTS.LIVE_EXHIBIT_TAB && currentExhibit)
        );
    }, [currentExhibit]);

    useEffect(() => {
        if (highlightKey !== -1 && currentExhibit && currentExhibitPage) {
            setActiveKey(CONSTANTS.LIVE_EXHIBIT_TAB);
            dispatch(actions.setActiveTab(CONSTANTS.LIVE_EXHIBIT_TAB));
        }
    }, [highlightKey, currentExhibit, currentExhibitPage, dispatch]);

    useEffect(() => {
        dispatch(actions.setExhibitTabName(activeKey));
    }, [activeKey, dispatch]);

    useEffect(() => {
        if (message?.module === "shareExhibit" && !!message?.value) {
            setHighlightKey(CONSTANTS.EXHIBIT_TABS_DATA.findIndex((tab) => tab.tabId === CONSTANTS.LIVE_EXHIBIT_TAB));
            fetchExhibitFileInfo(depositionID);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [message]);

    return { highlightKey, activeKey, setActiveKey: setActiveKey };
};

export const useShareExhibitFile = () => {
    const { state, deps } = useContext(GlobalStateContext);
    const { depositionID } = useParams<{ depositionID: string }>();
    const [fetchExhibitFileInfo] = useExhibitFileInfo();
    const { dataTrack, message, currentExhibit } = state.room;
    const [shareExhibit, shareExhibitPending, sharingExhibitFileError] = useAsyncCallback(
        async (exhibitFile: ExhibitFile, readOnly: boolean = false) => {
            const isShared =
                (await deps.apiService.shareExhibit({
                    depositionId: depositionID,
                    documentId: exhibitFile.id,
                    readOnly,
                })) !== undefined;
            const fileInfo: any = await fetchExhibitFileInfo(depositionID);
            if (fileInfo) {
                dataTrack.send(JSON.stringify({ module: "shareExhibit", value: fileInfo }));
            }
            return isShared;
        },
        []
    );

    useEffect(() => {
        if (message.module === "shareExhibit" && message.value) {
            fetchExhibitFileInfo(depositionID);
            message.module = null;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [message, depositionID]);

    return {
        shareExhibit,
        sharedExhibit: currentExhibit as ExhibitFile,
        shareExhibitPending,
        sharingExhibitFileError,
    };
};

export const useCloseSharedExhibit = () => {
    const { state, deps, dispatch } = useContext(GlobalStateContext);
    const { depositionID } = useParams<{ depositionID: string }>();
    const { dataTrack, message, currentExhibit, exhibitDocument, stampLabel, rawAnnotations } = state.room;
    const [closeSharedExhibit, pendingCloseSharedExhibit] = useAsyncCallback(
        async (isReadyOnly = false) => {
            if (stampLabel) {
                const exhibitDocumentData = await (exhibitDocument as CoreControls.Document)?.getFileData({
                    xfdfString: rawAnnotations,
                    flatten: true,
                });
                const arrData = new Uint8Array(exhibitDocumentData);
                const blob = new Blob([arrData]);
                await deps.apiService.closeStampedExhibit({ depositionID, stampLabel, blob });
            } else {
                await deps.apiService.closeExhibit({ depositionID });
            }
            dispatch(actions.stopShareExhibit());
            if (currentExhibit && dataTrack) {
                dataTrack.send(JSON.stringify({ module: "closeSharedExhibit", value: currentExhibit }));
            }
        },
        [exhibitDocument, stampLabel, dataTrack, rawAnnotations]
    );

    if (message.module === "closeSharedExhibit" && message?.value?.id === currentExhibit?.id) {
        dispatch(actions.stopShareExhibit());
        message.module = null;
    }

    return {
        closeSharedExhibit,
        pendingCloseSharedExhibit,
    };
};

export const useExhibitGetAnnotations = () => {
    const { deps } = useContext(GlobalStateContext);
    const { depositionID } = useParams<{ depositionID: string }>();

    const [getAllLatestAnnotations, , , savedAnnotations] = useAsyncCallback(async () => {
        const annotationsResult = await deps.apiService.getAnnotations({ depositionID });
        return annotationsResult;
    }, []);

    return {
        getAllLatestAnnotations,
        savedAnnotations: useMemo(() => savedAnnotations?.map((annotation) => annotation.details), [
            savedAnnotations,
        ]) as [],
    };
};

export const useExhibitSendAnnotation = () => {
    const { deps } = useContext(GlobalStateContext);
    const { depositionID } = useParams<{ depositionID: string }>();
    const [sendAnnotation] = useAsyncCallback(async (payload) => {
        const annotate = await deps.apiService.sendAnnotation({ depositionID, ...payload });
        return annotate;
    }, []);

    return {
        sendAnnotation,
    };
};

export const useExhibitRealTimeAnnotations = () => {
    const { state } = useContext(GlobalStateContext);
    const { currentUser } = state.room;
    const { subscribeToGroup, unsubscribeMethodFromGroup } = useSignalR("/depositionHub");
    const [realTimeAnnotation, setRealTimeAnnotation] = useState(null);

    useEffect(() => {
        const onReceiveAnnotations = (message) => {
            if (
                message.entityType !== NotificationEntityType.annotation ||
                (currentUser?.id && currentUser?.id === message?.content?.author?.id)
            )
                return;
            setRealTimeAnnotation(message?.content?.details);
        };
        subscribeToGroup("ReceiveNotification", onReceiveAnnotations);
        return () => {
            unsubscribeMethodFromGroup("ReceiveNotification", onReceiveAnnotations);
        };
    }, [subscribeToGroup, unsubscribeMethodFromGroup, currentUser]);

    return {
        realTimeAnnotation,
    };
};

export const useBringAllToMe = () => {
    const { deps } = useContext(GlobalStateContext);
    const { depositionID } = useParams<{ depositionID: string }>();
    const [page, setPage] = useState("1");

    const setBringAllToPage = useCallback((p) => setPage(p), []);

    const [bringAllToMe] = useAsyncCallback(async () => {
        return await deps.apiService.bringAllToMe({ depositionID, page });
    }, [page]);

    return {
        setBringAllToPage,
        bringAllToMe,
    };
};
