import React, { ReactElement, useState } from "react";
import { StyledDragger, StyledUploadButtonContainer } from "../../styles";
import Icon from "../../../../../components/Icon";
import { ReactComponent as uploadIcon } from "../../../../../assets/in-depo/upload.svg";
import { RcCustomRequestOptions } from "antd/lib/upload/interface";
import { Space } from "antd";
import ProgressBarRender from "./ProgressBarRender";

export type IUploadStatus = "success" | "pending" | "fail" | "initial";
interface IUploadButton {
    onUpload?: (options: RcCustomRequestOptions) => void;
    onUploadCompleted?: () => void;
}

export default function UploadButton({ onUpload, onUploadCompleted }: IUploadButton): ReactElement {
    const [disabled, setDisabled] = useState(false);
    return (
        <StyledUploadButtonContainer>
            <StyledDragger
                id="fileUpload"
                multiple={true}
                data-testid="upload-button"
                disabled={disabled}
                name="file"
                customRequest={onUpload}
                onChange={({ file }) => {
                    if (file.status === "done") {
                        onUploadCompleted()
                    }
                    setDisabled(file.status === "uploading")
                }}
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
        </StyledUploadButtonContainer>
    );
}
