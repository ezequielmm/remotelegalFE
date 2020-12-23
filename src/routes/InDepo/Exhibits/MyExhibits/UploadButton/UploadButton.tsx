import React, { ReactElement, useState } from "react";
import { RcCustomRequestOptions } from "antd/lib/upload/interface";
import { Space } from "antd";
import Icon from "../../../../../components/Icon";
import Text from "../../../../../components/Typography/Text";
import Dragger from "../../../../../components/Dragger";
import { ReactComponent as uploadIcon } from "../../../../../assets/icons/upload-cloud.svg";
import ProgressBarRender from "./ProgressBarRender";
import { MY_EXHIBITS_ALLOWED_FILE_TYPES } from "../../../../../constants/exhibits";

export type IUploadStatus = "success" | "pending" | "fail" | "initial";
interface IUploadButton {
    onUpload?: (options: RcCustomRequestOptions) => void;
    onUploadCompleted?: () => void;
}

export default function UploadButton({ onUpload, onUploadCompleted }: IUploadButton): ReactElement {
    const [disabled, setDisabled] = useState(false);
    return (
        <Dragger
            id="fileUpload"
            accept={MY_EXHIBITS_ALLOWED_FILE_TYPES}
            multiple
            data-testid="upload-button"
            disabled={disabled}
            name="file"
            customRequest={onUpload}
            onChange={({ file }) => {
                if (file.status === "done") {
                    onUploadCompleted();
                }
                setDisabled(file.status === "uploading");
            }}
            progress={{ strokeWidth: 8, showInfo: false, className: "progress" }}
            itemRender={(n, f) => <ProgressBarRender errors={f?.error} percent={f.percent} status={f.status} />}
        >
            <Space size="middle">
                <Icon icon={uploadIcon} style={{ fontSize: "2.6rem" }} />
                <Text state="white">UPLOAD FILES</Text>
            </Space>
        </Dragger>
    );
}
