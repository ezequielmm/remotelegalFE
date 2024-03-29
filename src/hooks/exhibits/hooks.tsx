import { useCallback, useContext, useEffect, useState, Key, useMemo } from "react";
import { TablePaginationConfig } from "antd/lib/table";
import { useParams } from "react-router";
import { SortOrder } from "antd/lib/table/interface";
import { uploadFileToS3 } from "../../services/UploadService";
import { GlobalStateContext } from "../../state/GlobalState";
import { ExhibitFile } from "../../types/ExhibitFile";
import useAsyncCallback from "../useAsyncCallback";
import * as CONSTANTS from "../../constants/exhibits";
import actions from "../../state/InDepo/InDepoActions";
import useSignalR from "../useSignalR";
import { Notification, NotificationAction, NotificationEntityType } from "../../types/Notification";
import { convertToXfdf } from "../../helpers/convertToXfdf";
import { AnnotationAction } from "../../types/Annotation";
import { serializeToString } from "../../helpers/serializeToString";
import { HTTP_METHOD } from "../../models/general";
import Message from "../../components/Message";

interface HandleFetchFilesSorterType {
    field?: Key | Key[];
    order?: SortOrder;
}

export const useUploadFileToS3 = (depositionID: string) => {
    const { deps } = useContext(GlobalStateContext);
    const upload = useCallback(
        async ({ onSuccess, onError, file, onProgress }) => {
            if (file.size > CONSTANTS.MY_EXHIBITS_UPLOAD_LIMIT_BYTES) {
                onError([CONSTANTS.MY_EXHIBITS_UPLOAD_ERROR_SIZE_TEXT]);
                return;
            }
            try {
                const parseFile = new File([file], encodeURI(file.name), { type: file.type });
                const preSignUploadExhibit = await deps.apiService.preSignUploadExhibit({
                    depositionId: depositionID,
                    filename: parseFile.name,
                    resourceId: file.uid,
                });
                uploadFileToS3(
                    preSignUploadExhibit.url,
                    parseFile,
                    (event) => onProgress({ percent: (event.loaded / event.total) * 100 }),
                    onSuccess,
                    onError,
                    HTTP_METHOD.PUT,
                    preSignUploadExhibit.headers
                );
            } catch (error) {
                onError([CONSTANTS.MY_EXHIBITS_UPLOAD_ERROR_TEXT]);
            }
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
    sortDirection;
    sortedField;
    refreshList;
} => {
    const [sortedField, setSortedField] = useState();
    const [sortDirection, setSortDirection] = useState();
    const { deps, dispatch } = useContext(GlobalStateContext);

    const [fetchFiles, loading, errorFetchFiles] = useAsyncCallback(async (payload) => {
        const depositionFiles = await deps.apiService.fetchDepositionsFiles({ depositionID, ...payload });
        const files = depositionFiles.map((file) => ({ key: file.id, ...file }));
        dispatch(actions.setMyExhibits(files));
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

    return { handleFetchFiles, loading, errorFetchFiles, sortDirection, sortedField, refreshList };
};

export const useSignedUrl = (file: ExhibitFile, isPublic?: boolean) => {
    const { deps } = useContext(GlobalStateContext);
    const { depositionID } = useParams<{ depositionID: string }>();
    const [documentUrl, setDocumentUrl] = useState(null);
    const [documentIsPublic, setDocumentIsPublic] = useState(isPublic);
    const getURLSigned = isPublic ? deps.apiService.getSignedUrl : deps.apiService.getPrivateSignedUrl;
    const [getURL, , error] = useAsyncCallback(async (payload) => {
        const result = await getURLSigned({ depositionID, documentId: file?.id, ...payload });
        setDocumentUrl(result?.url);
        setDocumentIsPublic(result?.isPublic);
        return result;
    }, []);
    useEffect(() => {
        if (file?.preSignedUrl) {
            setDocumentUrl(file?.preSignedUrl);
            setDocumentIsPublic(file?.isPublic ?? isPublic);
        } else {
            getURL();
        }
    }, [getURL, file, isPublic]);

    return { error, documentUrl, isPublic: documentIsPublic };
};

export const useExhibitFileInfo = () => {
    const { deps, dispatch } = useContext(GlobalStateContext);
    return useAsyncCallback(async (depositionID) => {
        const exhibitFile = await deps.apiService.getSharedExhibit(depositionID);
        if (exhibitFile) {
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
        if ((highlightKey !== -1 && currentExhibit) || (currentExhibit && currentExhibitPage)) {
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

    return { highlightKey, activeKey, setActiveKey };
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

export const useCloseSharedExhibit = () => {
    const { state, deps, dispatch } = useContext(GlobalStateContext);
    const { depositionID } = useParams<{ depositionID: string }>();
    const { sendAnnotation } = useExhibitSendAnnotation();
    const { currentExhibit, exhibitDocument, stampLabel, stamp, rawAnnotations } = state.room;
    const { subscribeToGroup, unsubscribeMethodFromGroup } = useSignalR("/depositionHub");

    useEffect(() => {
        const onReceiveClose = (message: Notification) => {
            if (
                message.action === NotificationAction.close &&
                currentExhibit &&
                currentExhibit.id === message.content
            ) {
                dispatch(actions.stopShareExhibit());
            }
        };
        subscribeToGroup("ReceiveNotification", onReceiveClose);
        return () => {
            unsubscribeMethodFromGroup("ReceiveNotification", onReceiveClose);
        };
    }, [subscribeToGroup, unsubscribeMethodFromGroup, dispatch, currentExhibit]);

    const [closeSharedExhibit, pendingCloseSharedExhibit] = useAsyncCallback(async () => {
        if (stampLabel) {
            if (stamp) {
                const newStamp = stamp;
                newStamp.setAttribute("flags", `${newStamp.getAttribute("flags")},readonly`);
                const annotationString = serializeToString(newStamp);
                await sendAnnotation({
                    action: AnnotationAction.Modify,
                    details: convertToXfdf(annotationString, AnnotationAction.Modify),
                });
            }

            await deps.apiService.closeStampedExhibit({ depositionID, stampLabel });
            dispatch(actions.addStamp(null));
        } else {
            await deps.apiService.closeExhibit({ depositionID });
        }
        dispatch(actions.stopShareExhibit());
    }, [exhibitDocument, stamp, stampLabel, rawAnnotations]);

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
        savedAnnotations: useMemo(
            () => savedAnnotations?.map((annotation) => annotation.details),
            [savedAnnotations]
        ) as [],
    };
};

export const useExhibitRealTimeAnnotations = () => {
    const { state } = useContext(GlobalStateContext);
    const { currentUser } = state.user;
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

export const useStampMediaExhibits = (): ((stampLabel: string) => void) => {
    const { dispatch } = useContext(GlobalStateContext);
    const { depositionID } = useParams<{ depositionID: string }>();
    const { subscribeToGroup, unsubscribeMethodFromGroup, signalR, isReconnected, sendMessage } =
        useSignalR("/depositionHub");

    useEffect(() => {
        const onReceiveStamp = (message: Notification) => {
            if (message.entityType === NotificationEntityType.stamp && message?.content?.stampLabel !== undefined) {
                dispatch(actions.setStampLabel(message.content.stampLabel));
            }
            if (message.action === NotificationAction.error) {
                Message({
                    content: message?.content?.message || "",
                    type: "error",
                    duration: 3,
                });
            }
        };
        subscribeToGroup("ReceiveNotification", onReceiveStamp);
        return () => {
            unsubscribeMethodFromGroup("ReceiveNotification", onReceiveStamp);
        };
    }, [subscribeToGroup, unsubscribeMethodFromGroup, dispatch]);

    return useCallback(
        (stampLabel: string) => {
            if ((signalR?.connectionState === "Connected" || isReconnected) && depositionID) {
                dispatch(actions.setStampLabel(stampLabel));
                sendMessage("UpdateMediaStamp", { depositionId: depositionID, stampLabel });
            }
        },
        [depositionID, isReconnected, signalR?.connectionState, sendMessage, dispatch]
    );
};
