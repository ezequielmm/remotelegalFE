import { UploadFileStatus } from "antd/lib/upload/interface";
import React, { ReactElement, useEffect, useState } from "react";
import ProgressBar from "../../../../../../components/ProgressBar";
import * as CONSTANTS from "../../../../../../constants/exhibits";

interface Props {
    error: boolean;
    percent: number;
    status: UploadFileStatus;
    timeToCloseAfterComplete?: number;
}

export default function ProgressBarRender({
    percent,
    error,
    status,
    timeToCloseAfterComplete = 3000,
}: Props): ReactElement {
    const [hide, setHide] = useState(false);
    useEffect(() => {
        let delayHide;
        if (status === "done") {
            delayHide = setTimeout(() => {
                setHide(true);
            }, timeToCloseAfterComplete);
        }
        return () => clearTimeout(delayHide);
    }, [status, timeToCloseAfterComplete]);
    if (hide) return null;
    return (
        <ProgressBar
            percent={percent}
            hasError={error}
            statusText={error ? CONSTANTS.MY_EXHIBITS_UPLOAD_ERROR_TEXT : CONSTANTS.MY_EXHIBITS_UPLOAD_TEXT}
            onClose={() => setHide(true)}
        />
    );
}
