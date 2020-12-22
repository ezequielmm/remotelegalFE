import React, { ReactElement } from "react";
import { Space } from "antd";
import Text from "../Typography/Text";
import Icon from "../Icon";
import Button from "../Button";
import { ReactComponent as attachIcon } from "../../assets/icons/attach-clip.svg";
import { ReactComponent as closeIcon } from "../../assets/icons/close.svg";
import { StyledProgressBar, StyledComponentContainer, StyledProgressBarContainer } from "./styles";
import { theme } from "../../constants/styles/theme";

interface IProgressBar {
    statusText?: string;
    percent: number;
    hasError?: boolean;
    onClose?: (ev: any) => void;
}

export default function ProgressBar({
    statusText = "",
    percent,
    hasError = false,
    onClose,
}: IProgressBar): ReactElement {
    return (
        <StyledComponentContainer>
            <Text state="white" size="small">
                <Space>
                    <Icon icon={attachIcon} style={{ fontSize: "16px" }} />
                    {statusText}
                </Space>
            </Text>
            <StyledProgressBarContainer>
                <StyledProgressBar
                    data-testId="progress-bar"
                    percent={percent}
                    status={hasError ? "exception" : "active"}
                    strokeColor={hasError ? theme.default.errorColor : theme.default.successColor}
                    showInfo={false}
                    trailColor={theme.default.secondary}
                />
                {hasError && (
                    <Button type="link" onClick={onClose}>
                        <Text state="white">
                            <Icon data-testid="progress-bar-close-icon" icon={closeIcon} style={{ fontSize: "12px" }} />
                        </Text>
                    </Button>
                )}
            </StyledProgressBarContainer>
        </StyledComponentContainer>
    );
}
