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
    errors?: string[];
    onClose?: (ev: any) => void;
}

export default function ProgressBar({ statusText = "", percent, errors = [], onClose }: IProgressBar): ReactElement {
    return (
        <StyledComponentContainer>
            {errors.length === 0 && (
                <Text state="white" size="small">
                    <Space>
                        <Icon icon={attachIcon} style={{ fontSize: "16px" }} />
                        {statusText}
                    </Space>
                </Text>
            )}
            {errors.map((error) => (
                <Text key={error} state="white" size="small" ellipsis>
                    <Space>
                        <Icon icon={attachIcon} style={{ fontSize: "16px" }} />
                        {error}
                    </Space>
                </Text>
            ))}
            <StyledProgressBarContainer>
                <StyledProgressBar
                    data-testId="progress-bar"
                    percent={percent}
                    status={errors.length ? "exception" : "active"}
                    strokeColor={errors.length ? theme.default.errorColor : theme.default.successColor}
                    showInfo={false}
                    trailColor={theme.default.secondary}
                />
                {errors.length > 0 && (
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