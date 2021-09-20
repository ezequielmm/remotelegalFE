import { ReactElement, useState } from "react";
import { datadogLogs } from "@datadog/browser-logs";
import { UploadRequestOption } from "rc-upload/lib/interface";
import Dragger from "prp-components-library/src/components/Dragger";
import Icon from "prp-components-library/src/components/Icon";
import Space from "prp-components-library/src/components/Space";
import Text from "prp-components-library/src/components/Text";
import { ReactComponent as uploadIcon } from "../../../../../assets/icons/upload-cloud.svg";
import ProgressBarRender from "./ProgressBarRender";
import { MY_EXHIBITS_ALLOWED_FILE_TYPES } from "../../../../../constants/exhibits";
import ColorStatus from "../../../../../types/ColorStatus";

interface IUploadButton {
    onUpload?: (options: UploadRequestOption<any>) => void;
    refreshList?: () => void;
}

export default function UploadButton({ onUpload, refreshList }: IUploadButton): ReactElement {
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
                setDisabled(file.status === "uploading");
            }}
            progress={{ strokeWidth: 8, showInfo: false, className: "progress" }}
            itemRender={(_, file) => (
                <ProgressBarRender
                    errors={file?.error}
                    percent={file.percent}
                    status={file.status}
                    uploadId={file.uid}
                    refreshList={refreshList}
                />
            )}
            beforeUpload={(file, FileList) => {
                if (file.uid === FileList[0].uid) {
                    const fileNames = Array.from(FileList, (f) => f.name);
                    datadogLogs.logger.info(`Uploaded ${FileList.length} exhibit files`, { fileNames });
                }
            }}
        >
            <Space size="middle" justify="center" align="center" fullWidth>
                <Icon icon={uploadIcon} size="2.5rem" />
                <Text state={ColorStatus.white}>UPLOAD FILES</Text>
            </Space>
        </Dragger>
    );
}
