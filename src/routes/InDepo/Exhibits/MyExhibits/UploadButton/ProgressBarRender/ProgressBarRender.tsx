import { UploadFileStatus } from "antd/lib/upload/interface";
import { ReactElement, useEffect, useState, useRef, useContext } from "react";
import ProgressBar from "prp-components-library/src/components/ProgressBar";
import { GlobalStateContext } from "../../../../../../state/GlobalState";
import * as CONSTANTS from "../../../../../../constants/exhibits";

interface Props {
    percent: number;
    status: UploadFileStatus;
    timeToCloseAfterComplete?: number;
    timeToCloseAfterError?: number;
    errors?: string[];
    fileUploadComplete?: boolean;
    fileUploadError?: boolean;
    refreshList?: () => void;
}

export default function ProgressBarRender({
    percent,
    status,
    timeToCloseAfterComplete = CONSTANTS.MY_EXHIBITS_TIME_TO_CLOSE_AFTER_COMPLETE,
    timeToCloseAfterError = CONSTANTS.MY_EXHIBITS_TIME_TO_CLOSE_AFTER_ERROR,
    errors = [],
    fileUploadComplete,
    fileUploadError,
    refreshList,
}: Props): ReactElement {
    const [hide, setHide] = useState(false);
    const [statusFileText, setStatusFileText] = useState<string>("");
    const [customErrors, setCustomErrors] = useState(errors);
    const errorsRef = useRef(errors);
    const uploadTimeOut = useRef(null);
    const { state } = useContext(GlobalStateContext);
    const { isReconnecting, isReconnected } = state?.signalR?.signalRConnectionStatus;

    useEffect(() => {
        errorsRef.current = errors;
    }, [errors]);

    useEffect(() => {
        let delayHide;
        const statusTxt = fileUploadComplete
            ? CONSTANTS.MY_EXHIBITS_UPLOAD_COMPLETE_TEXT
            : CONSTANTS.MY_EXHIBITS_UPLOAD_PROCESSING_TEXT;
        const hideTimeOut = (time: number) => setTimeout(() => setHide(true), time);
        const onError = (error: string) => {
            setStatusFileText(error);
            setCustomErrors([error]);
        };

        if (fileUploadError) {
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
                    if (fileUploadComplete) {
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
    }, [status, timeToCloseAfterComplete, timeToCloseAfterError, fileUploadComplete, refreshList, fileUploadError]);

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
