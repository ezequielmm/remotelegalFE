import { UploadFileStatus } from "antd/lib/upload/interface";
import { ReactElement, useEffect, useState, useRef, useContext } from "react";
import ProgressBar from "prp-components-library/src/components/ProgressBar";
import { GlobalStateContext } from "../../../../../../state/GlobalState";
import * as CONSTANTS from "../../../../../../constants/exhibits";
import useSignalR from "../../../../../../hooks/useSignalR";
import { Notification, NotificationEntityType, NotificationAction } from "../../../../../../types/Notification";

interface Props {
    percent: number;
    status: UploadFileStatus;
    fileName: string;
    timeToCloseAfterComplete?: number;
    timeToCloseAfterError?: number;
    errors?: string[];
    refreshList?: () => void;
}

export default function ProgressBarRender({
    percent,
    status,
    fileName,
    timeToCloseAfterComplete = CONSTANTS.MY_EXHIBITS_TIME_TO_CLOSE_AFTER_COMPLETE,
    timeToCloseAfterError = CONSTANTS.MY_EXHIBITS_TIME_TO_CLOSE_AFTER_ERROR,
    errors = [],
    refreshList,
}: Props): ReactElement {
    const [hide, setHide] = useState(false);
    const [statusFileText, setStatusFileText] = useState<string>("");
    const [customErrors, setCustomErrors] = useState(errors);
    const [fileUploadStatus, setFileUploadStatus] = useState<CONSTANTS.UPLOAD_STATE>(CONSTANTS.UPLOAD_STATE.PENDING);
    const errorsRef = useRef(errors);
    const uploadTimeOut = useRef(null);
    const { state } = useContext(GlobalStateContext);
    const { isReconnecting, isReconnected } = state?.signalR?.signalRConnectionStatus;
    const { subscribeToGroup, unsubscribeMethodFromGroup, signalR } = useSignalR("/depositionHub");
    useEffect(() => {
        errorsRef.current = errors;
    }, [errors]);

    useEffect(() => {
        let delayHide;
        const statusTxt =
            fileUploadStatus === CONSTANTS.UPLOAD_STATE.COMPLETE
                ? CONSTANTS.MY_EXHIBITS_UPLOAD_COMPLETE_TEXT
                : CONSTANTS.MY_EXHIBITS_UPLOAD_PROCESSING_TEXT;
        const hideTimeOut = (time: number) => setTimeout(() => setHide(true), time);
        const onError = (error: string) => {
            setStatusFileText(error);
            setCustomErrors([error]);
        };

        if (fileUploadStatus === CONSTANTS.UPLOAD_STATE.ERROR) {
            clearTimeout(uploadTimeOut.current);
            onError(CONSTANTS.MY_EXHIBITS_UPLOAD_ERROR_TEXT);
            delayHide = hideTimeOut(timeToCloseAfterError);
            refreshList();
        } else {
            switch (status) {
                case "done":
                    uploadTimeOut.current = setTimeout(() => {
                        onError(CONSTANTS.MY_EXHIBITS_UPLOAD_ERROR_TEXT);
                        delayHide = hideTimeOut(timeToCloseAfterError);
                        refreshList();
                    }, CONSTANTS.MY_EXHIBITS_UPLOAD_TIMEOUT);
                    if (fileUploadStatus === CONSTANTS.UPLOAD_STATE.COMPLETE) {
                        delayHide = hideTimeOut(timeToCloseAfterComplete);
                        clearTimeout(uploadTimeOut.current);
                    }
                    setStatusFileText(statusTxt);
                    break;
                case "error":
                    onError(errorsRef.current.length ? errorsRef.current[0] : CONSTANTS.MY_EXHIBITS_UPLOAD_ERROR_TEXT);
                    delayHide = hideTimeOut(timeToCloseAfterError);
                    break;
                default:
                    setCustomErrors([]);
                    setStatusFileText(CONSTANTS.MY_EXHIBITS_UPLOAD_TEXT);
            }
        }
        return () => {
            clearTimeout(delayHide);
            clearTimeout(uploadTimeOut.current);
        };
    }, [status, timeToCloseAfterComplete, timeToCloseAfterError, fileUploadStatus, refreshList]);

    useEffect(() => {
        if (isReconnecting) {
            clearTimeout(uploadTimeOut.current);
        }
    }, [isReconnecting]);

    useEffect(() => {
        if (isReconnected) {
            setHide(true);
            refreshList();
        }
    }, [isReconnected, refreshList]);

    useEffect(() => {
        let onFileUploadComplete;
        if (signalR && subscribeToGroup && unsubscribeMethodFromGroup) {
            onFileUploadComplete = (message: Notification) => {
                if (message?.entityType === NotificationEntityType.exhibit) {
                    if (message?.action === NotificationAction.create) {
                        setFileUploadStatus(CONSTANTS.UPLOAD_STATE.COMPLETE);
                        refreshList();
                    }
                    if (message?.action === NotificationAction.error && String(message?.content).includes(fileName)) {
                        setFileUploadStatus(CONSTANTS.UPLOAD_STATE.ERROR);
                    }
                }
            };
            subscribeToGroup("ReceiveNotification", onFileUploadComplete);
        }
        return () => {
            if (onFileUploadComplete) {
                unsubscribeMethodFromGroup("ReceiveNotification", onFileUploadComplete);
            }
        };
    }, [signalR, subscribeToGroup, unsubscribeMethodFromGroup, refreshList, fileName]);

    if (hide) return null;
    return (
        <ProgressBar
            percent={percent}
            errors={customErrors}
            statusText={statusFileText}
            onClose={() => setHide(true)}
        />
    );
}
