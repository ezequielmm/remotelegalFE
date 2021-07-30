import { ReactElement, useState } from "react";
// TODO: fix this interface request
// import { RcCustomRequestOptions } from "antd/lib/upload/interface";
import Dragger from "prp-components-library/src/components/Dragger";
import Icon from "prp-components-library/src/components/Icon";
import Space from "prp-components-library/src/components/Space";
import Text from "prp-components-library/src/components/Text";
import { ReactComponent as uploadIcon } from "../../../../../assets/icons/upload-cloud.svg";
import ProgressBarRender from "./ProgressBarRender";
import { MY_EXHIBITS_ALLOWED_FILE_TYPES } from "../../../../../constants/exhibits";
import ColorStatus from "../../../../../types/ColorStatus";

export type IUploadStatus = "success" | "pending" | "fail" | "initial";
interface IUploadButton {
    onUpload?: (options: any) => void;
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
            <Space size="middle" justify="center" align="center" fullWidth>
                <Icon icon={uploadIcon} size="2.5rem" />
                <Text state={ColorStatus.white}>UPLOAD FILES</Text>
            </Space>
        </Dragger>
    );
}
