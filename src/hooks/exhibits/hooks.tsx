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

export const useSignedUrl = (documentId: string, preSignedUrl?: string) => {
    const { deps } = useContext(GlobalStateContext);
    const [getURL, pending, error, documentUrl] = useAsyncCallback(async (payload) => {
        return preSignedUrl ?? (await deps.apiService.getDocumentUrl({ documentId, ...payload }));
    }, []);
    useEffect(() => {
        getURL();
    }, [getURL]);

    return { getURL, pending, error, documentUrl };
};

export const useExhibitFileInfo = () => {
    const { deps, dispatch } = useContext(GlobalStateContext);
    return useAsyncCallback(async (depositionID) => {
        const exhibitFile: ExhibitFile = await deps.apiService.getSharedExhibit(depositionID);
        if (exhibitFile) {
            const user = await deps.apiService.currentUser();
            dispatch(actions.setIsCurrentExhibitOwner(user?.id && user?.id === exhibitFile?.addedBy?.id));
            dispatch(actions.setCurrentUser(user));
            dispatch(actions.setSharedExhibit(exhibitFile));
        }
        return exhibitFile;
    }, []);
};

export const useExhibitTabs = () => {
    const { state, dispatch } = useContext(GlobalStateContext);
    const { depositionID } = useParams<{ depositionID: string }>();
    const { currentExhibit, message, isCurrentExhibitOwner } = state.room;
    const [highlightKey, setHighlightKey] = useState<number>(-1);
    const [activeKey, setActiveKey] = useState<string>(CONSTANTS.DEFAULT_ACTIVE_TAB);
    const [fetchExhibitFileInfo] = useExhibitFileInfo();

    useEffect(() => {
        setHighlightKey(
            CONSTANTS.EXHIBIT_TABS_DATA.findIndex((tab) => tab.tabId === CONSTANTS.LIVE_EXHIBIT_TAB && currentExhibit)
        );
    }, [currentExhibit]);

    useEffect(() => {
        if (highlightKey !== -1 && currentExhibit && isCurrentExhibitOwner) {
            setActiveKey(CONSTANTS.LIVE_EXHIBIT_TAB);
            dispatch(actions.setActiveTab(CONSTANTS.LIVE_EXHIBIT_TAB));
        }
    }, [highlightKey, currentExhibit, isCurrentExhibitOwner, dispatch]);

    useEffect(() => {
        dispatch(actions.setExhibitTabName(activeKey));
    }, [activeKey, dispatch]);

    useEffect(() => {
        if (message.module === "shareExhibit" && !!message.value) {
            setHighlightKey(CONSTANTS.EXHIBIT_TABS_DATA.findIndex((tab) => tab.tabId === CONSTANTS.LIVE_EXHIBIT_TAB));
            fetchExhibitFileInfo(depositionID);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [message]);

    return { highlightKey, activeKey, setActiveKey: setActiveKey };
};

export const useShareExhibitFile = () => {
    const { state, deps, dispatch } = useContext(GlobalStateContext);
    const { depositionID } = useParams<{ depositionID: string }>();
    const [fetchExhibitFileInfo] = useExhibitFileInfo();
    const { dataTrack, message, currentExhibit, exhibitDocument, stampLabel, rawAnnotations } = state.room;
    const [shareExhibit, shareExhibitPending, sharingExhibitFileError] = useAsyncCallback(
        async (exhibitFile: ExhibitFile) => {
            const isShared = (await deps.apiService.shareExhibit(exhibitFile.id)) !== undefined;
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
        }
        if (message.module === "closeSharedExhibit" && message?.value?.id === currentExhibit?.id) {
            dispatch(actions.stopShareExhibit());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [message]);

    const [closeSharedExhibit, pendingCloseSharedExhibit] = useAsyncCallback(async () => {
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
    }, [exhibitDocument, stampLabel, dataTrack, rawAnnotations]);

    return {
        shareExhibit,
        sharedExhibit: currentExhibit as ExhibitFile,
        shareExhibitPending,
        sharingExhibitFileError,
        closeSharedExhibit,
        pendingCloseSharedExhibit,
    };
};
export const useExhibitAnnotation = () => {
    const [hasPollingError, setHasPollingError] = useState(false);
    const { state, deps, dispatch } = useContext(GlobalStateContext);
    const { depositionID } = useParams<{ depositionID: string }>();
    const { currentExhibit, currentExhibitTabName, annotations, lastAnnotationId } = state.room;

    const [getAnnotations] = useAsyncCallback(async (payload) => {
        const annotations = await deps.apiService.getAnnotations({ depositionID, ...payload });
        return annotations;
    }, []);

    const [sendAnnotation, sending] = useAsyncCallback(async (payload) => {
        const annotate = await deps.apiService.sendAnnotation({ depositionID, ...payload });
        return annotate;
    }, []);

    useEffect(() => {
        if (currentExhibit && currentExhibitTabName === CONSTANTS.LIVE_EXHIBIT_TAB) {
            getAnnotations();
        }
    }, [currentExhibitTabName, getAnnotations, currentExhibit]);

    useEffect(
        () => {
            const delay = setInterval(async () => {
                try {
                    if (sending || !currentExhibit) return;
                    const annotationsResult = await deps.apiService.getAnnotations({
                        depositionID,
                        startingAnnotationId: lastAnnotationId || undefined,
                    });

                    if (annotationsResult.length) {
                        dispatch(
                            actions.setExhibitAnnotations({
                                annotations: annotationsResult,
                            })
                        );
                    }
                } catch (e) {
                    setHasPollingError(true);
                }
            }, CONSTANTS.EXHIBITS_SYNC_ANNOTATION_POLLING_INTERVAL);
            if (currentExhibitTabName !== CONSTANTS.LIVE_EXHIBIT_TAB || hasPollingError) {
                clearTimeout(delay);
            }
            return () => clearTimeout(delay);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [lastAnnotationId, currentExhibit, currentExhibitTabName, sending]
    );
    return {
        sendAnnotation,
        annotations: useMemo(() => annotations?.map((annotation) => annotation.details), [annotations]) as [],
    };
};

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
            const enteredExhibits = await deps.apiService.getEnteredExhibits({ depositionID, ...payload });
            return enteredExhibits;
        },
        []
    );

    const handleFetchFiles = useCallback(
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
