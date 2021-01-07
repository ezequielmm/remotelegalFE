import React from "react";
import { StyledAttachButton, StyledUploadButton } from "./styles";
import Text from "../Typography/Text";
import Icon from "../Icon";
import { ReactComponent as UploadCloudIcon } from "../../assets/icons/upload-cloud.svg";
import { ReactComponent as AttachClipIcon } from "../../assets/icons/attach-clip.svg";
import { ReactComponent as CloseIcon } from "../../assets/icons/close.svg";
export interface IUploadButton {
    fileName?: string;
    label: string;
    removeFile: (ev: React.MouseEvent) => void;
}
const UploadButton = ({ fileName, label, removeFile }: IUploadButton) => {
    return fileName ? (
        <StyledAttachButton icon={<Icon style={{ fontSize: "20px" }} icon={AttachClipIcon} />} tabIndex={-1}>
            <Text state="primary">{fileName}</Text>
            <Icon
                icon={CloseIcon}
                onClick={removeFile}
                className="close-icon"
                style={{ fontSize: "16px" }}
                tabIndex={0}
            />
        </StyledAttachButton>
    ) : (
        <StyledUploadButton
            data-testid="caption_input"
            icon={<Icon style={{ fontSize: "24px" }} icon={UploadCloudIcon} />}
            tabIndex={-1}
        >
            {label}
        </StyledUploadButton>
    );
};
export default UploadButton;
