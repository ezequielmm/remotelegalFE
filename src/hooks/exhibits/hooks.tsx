import { useCallback, useContext, useEffect, useState, Key, useMemo } from "react";
import { TablePaginationConfig } from "antd/lib/table";
import { useParams } from "react-router";
import uploadFile from "../../services/UploadService";
import { GlobalStateContext } from "../../state/GlobalState";
import { ExhibitFile } from "../../types/ExhibitFile";
import useAsyncCallback from "../useAsyncCallback";
import * as CONSTANTS from "../../constants/exhibits";
import actions from "../../state/InDepo/InDepoActions";

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
        return depositionFiles.map((file) => ({ key: file.id, ...file }));
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
            dispatch(actions.setSharedExhibit(exhibitFile));
            dispatch(actions.setIsCurrentExhibitOwner(user?.id && user?.id === exhibitFile?.addedBy?.id));
        }
        return exhibitFile;
    }, []);
};

export const useExhibitTabs = () => {
    const { state, dispatch } = useContext(GlobalStateContext);
    const { depositionID } = useParams<{ depositionID: string }>();
    const { message } = state.room;
    const [highlightKey, setHighlightKey] = useState<number>(-1);
    const [activeKey, setActivetKey] = useState<string>(CONSTANTS.DEFAULT_ACTIVE_TAB);

    const [fetchExhibitFileInfo] = useExhibitFileInfo();

    useEffect(() => {
        setHighlightKey(
            CONSTANTS.EXHIBIT_TABS_DATA.findIndex((tab) => tab.tabId === "liveExhibits" && state.room.currentExhibit)
        );
    }, [state]);

    useEffect(() => {
        if (highlightKey !== -1 && state.room.currentExhibit && state.room.isCurrentExhibitOwner) {
            setActivetKey(CONSTANTS.EXHIBIT_TABS[highlightKey]);
            dispatch(actions.setActiveTab(CONSTANTS.LIVE_EXHIBIT_TAB));
        }
    }, [highlightKey, state.room.currentExhibit, state.room.isCurrentExhibitOwner, dispatch]);

    useEffect(() => {
        dispatch(actions.setExhibitTabName(activeKey));
    }, [activeKey, dispatch]);

    useEffect(() => {
        if (message.module === "shareExhibit" && !!message.value) {
            setHighlightKey(CONSTANTS.EXHIBIT_TABS_DATA.findIndex((tab) => tab.tabId === CONSTANTS.LIVE_EXHIBIT_TAB));
            fetchExhibitFileInfo(depositionID);
        }
    }, [message, depositionID, fetchExhibitFileInfo]);

    return { highlightKey, activeKey, setActivetKey };
};

export const useShareExhibitFile = () => {
    const { state, deps, dispatch } = useContext(GlobalStateContext);
    const { depositionID } = useParams<{ depositionID: string }>();
    const [fetchExhibitFileInfo] = useExhibitFileInfo();
    const { dataTrack, message, currentExhibit } = state.room;
    const [shareExhibit, shareExhibitPending, sharingExhibitFileError, sharedExhibit] = useAsyncCallback(
        async (exhibitFile: ExhibitFile) => {
            const isShared = (await deps.apiService.shareExhibit(exhibitFile.id)) !== undefined;
            fetchExhibitFileInfo(depositionID);
            return isShared;
        },
        []
    );
    useEffect(() => {
        if (sharedExhibit && currentExhibit && dataTrack) {
            dataTrack.send(JSON.stringify({ module: "shareExhibit", value: currentExhibit }));
        }
    }, [sharedExhibit, sharingExhibitFileError, dataTrack, dispatch, currentExhibit]);

    useEffect(() => {
        if (message.module === "shareExhibit" && message.value) {
            dispatch(actions.setSharedExhibit(message.value));
        }
    }, [message, dispatch]);
    return {
        shareExhibit,
        sharedExhibit: currentExhibit,
        shareExhibitPending,
        sharingExhibitFileError,
    };
};
export const useExhibitAnnotation = () => {
    const { state, deps, dispatch } = useContext(GlobalStateContext);
    const { depositionID } = useParams<{ depositionID: string }>();
    const { currentExhibit, currentExhibitTabName, annotations, lastAnnotationId } = state.room;

    const [getAnnotations, getAnnotationsPending, , latestAnnotations] = useAsyncCallback(async (payload) => {
        const annotations = await deps.apiService.getAnnotations({ depositionID, ...payload });
        return annotations;
    }, []);

    const [sendAnnotation, sending] = useAsyncCallback(async (payload) => {
        const annotate = await deps.apiService.sendAnnotation({ depositionID, ...payload });
        return annotate;
    }, []);

    useEffect(() => {
        if (currentExhibit && currentExhibitTabName === "liveExhibits") {
            getAnnotations();
        }
    }, [currentExhibitTabName, getAnnotations, currentExhibit]);

    useEffect(() => {
        let delay;
        if (!sending && latestAnnotations && !getAnnotationsPending && currentExhibitTabName === "liveExhibits") {
            delay = setTimeout(() => {
                getAnnotations({ startingAnnotationId: lastAnnotationId || undefined });
                if (latestAnnotations.length) {
                    dispatch(
                        actions.setExhibitAnnotations({
                            annotations: latestAnnotations,
                        })
                    );
                }
            }, CONSTANTS.MY_EXHIBITS_SYNC_ANNOTATION_POLLING_INTERVAL);
        }
        return () => clearTimeout(delay);
    }, [
        getAnnotations,
        latestAnnotations,
        getAnnotationsPending,
        currentExhibitTabName,
        currentExhibit,
        lastAnnotationId,
        dispatch,
        sending,
    ]);
    return {
        sendAnnotation,
        annotations: useMemo(() => annotations?.map((annotation) => annotation.details), [annotations]) as [],
    };
};
