import { UploadFileStatus } from "antd/lib/upload/interface";
import React, { ReactElement, useEffect, useState } from "react";
import ProgressBar from "../../../../../../components/ProgressBar";
import * as CONSTANTS from "../../../../../../constants/exhibits";

interface Props {
    percent: number;
    status: UploadFileStatus;
    timeToCloseAfterComplete?: number;
    timeToCloseAfterError?: number;
    errors?: string[];
}

export default function ProgressBarRender({
    percent,
    status,
    timeToCloseAfterComplete = CONSTANTS.MY_EXHIBITS_TIME_TO_CLOSE_AFTER_COMPLETE,
    timeToCloseAfterError = CONSTANTS.MY_EXHIBITS_TIME_TO_CLOSE_AFTER_ERROR,
    errors = [],
}: Props): ReactElement {
    const [hide, setHide] = useState(false);
    const [statusFileText, setStatusFileText] = useState<string>("");
    useEffect(() => {
        let delayHide;
        if (status === "done") {
            setStatusFileText(CONSTANTS.MY_EXHIBITS_UPLOAD_COMPLETE_TEXT);
            delayHide = setTimeout(() => {
                setHide(true);
            }, timeToCloseAfterComplete);
        } else if (status === "error") {
            setStatusFileText(CONSTANTS.MY_EXHIBITS_UPLOAD_ERROR_TEXT);
            delayHide = setTimeout(() => {
                setHide(true);
            }, timeToCloseAfterError);
        } else if (status === "uploading") {
            setStatusFileText(CONSTANTS.MY_EXHIBITS_UPLOAD_TEXT);
        }
        return () => clearTimeout(delayHide);
    }, [status, timeToCloseAfterComplete, timeToCloseAfterError]);
    if (hide) return null;
    return <ProgressBar percent={percent} errors={errors} statusText={statusFileText} onClose={() => setHide(true)} />;
}
