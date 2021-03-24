import React from "react";
import { ButtonProps } from "antd/lib/button";
import { StyledAttachButton, StyledUploadButton } from "./styles";
import Text from "../Typography/Text";
import Icon from "../Icon";
import ColorStatus from "../../types/ColorStatus";
import { ReactComponent as UploadCloudIcon } from "../../assets/icons/upload-cloud.svg";
import { ReactComponent as AttachClipIcon } from "../../assets/icons/attach-clip.svg";
import { ReactComponent as CloseIcon } from "../../assets/icons/close.svg";

export interface IUploadButton extends Omit<ButtonProps, "type"> {
    fileName?: string;
    label: string;
    removeFile: (ev: React.MouseEvent) => void;
}
const UploadButton = ({ fileName, label, removeFile, ...rest }: IUploadButton) => {
    return fileName ? (
        <StyledAttachButton {...rest} icon={<Icon size={8} icon={AttachClipIcon} />} tabIndex={-1}>
            <Text state={ColorStatus.primary}>{fileName}</Text>
            <Icon icon={CloseIcon} onClick={removeFile} className="close-icon" size={6} tabIndex={0} />
        </StyledAttachButton>
    ) : (
        <StyledUploadButton
            {...rest}
            data-testid="caption_input"
            icon={<Icon size={9} icon={UploadCloudIcon} />}
            tabIndex={-1}
        >
            {label}
        </StyledUploadButton>
    );
};
export default UploadButton;
