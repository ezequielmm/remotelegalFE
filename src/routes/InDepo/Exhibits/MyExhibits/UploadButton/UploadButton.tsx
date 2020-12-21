import React, { ReactElement, useState } from "react";
import { StyledDragger } from "../../styles";
import Icon from "../../../../../components/Icon";
import { ReactComponent as uploadIcon } from "../../../../../assets/in-depo/upload.svg";
import { RcCustomRequestOptions } from "antd/lib/upload/interface";
import { Space } from "antd";
import ProgressBarRender from "./ProgressBarRender";

export type IUploadStatus = "success" | "pending" | "fail" | "initial";
interface IUploadButton {
    onUpload?: (options: RcCustomRequestOptions) => void;
}

export default function UploadButton({ onUpload }: IUploadButton): ReactElement {
    const [disabled, setDisabled] = useState(false);
    return (
        <>
            <StyledDragger
                id="fileUpload"
                multiple={true}
                data-testid="upload-button"
                disabled={disabled}
                name="file"
                customRequest={onUpload}
                onChange={(data) => setDisabled(data.file.status === "uploading")}
                progress={{ strokeWidth: 8, showInfo: false, className: "progress" }}
                itemRender={(n, f, fl) => (
                    <ProgressBarRender error={f.status === "error"} percent={f.percent} status={f.status} />
                )}
            >
                <Space size="middle">
                    <Icon icon={uploadIcon} style={{ fontSize: "24px" }} />
                    <label>UPLOAD FILES</label>
                </Space>
            </StyledDragger>
        </>
    );
}
