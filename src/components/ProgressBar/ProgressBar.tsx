import React, { ReactElement } from "react";
import Space from "../Space";
import Text from "../Typography/Text";
import Icon from "../Icon";
import Button from "../Button";
import { ReactComponent as attachIcon } from "../../assets/icons/attach-clip.svg";
import { ReactComponent as closeIcon } from "../../assets/icons/close.svg";
import { StyledProgressBar, StyledComponentContainer, StyledProgressBarContainer } from "./styles";
import { theme } from "../../constants/styles/theme";
import ColorStatus from "../../types/ColorStatus";
import * as CONSTANTS from "../../constants/depositionDetails";

interface IProgressBar {
    statusText?: string;
    percent: number;
    errors?: string[];
    size?: number;
    onClose?: (ev: any) => void;
}

export default function ProgressBar({ statusText = "", percent, errors = [], onClose }: IProgressBar): ReactElement {
    return (
        <StyledComponentContainer data-testid={CONSTANTS.DETAILS_TRANSCRIPT_UPLOAD_PROGRESS_BAR_TEST_ID}>
            {errors.length === 0 && (
                <Text state={ColorStatus.white} size="small">
                    <Space>
                        <Icon icon={attachIcon} size={6} />
                        {statusText}
                    </Space>
                </Text>
            )}
            {errors.map((error) => (
                <Text key={error} state={ColorStatus.error} size="small" ellipsis>
                    <Space>
                        <Icon icon={attachIcon} size={6} />
                        {error}
                    </Space>
                </Text>
            ))}
            <StyledProgressBarContainer>
                <StyledProgressBar
                    data-testid="progress-bar"
                    percent={percent}
                    status={errors.length ? "exception" : "active"}
                    strokeColor={errors.length ? theme.default.errorColor : theme.default.successColor}
                    showInfo={false}
                />
                {errors.length > 0 && (
                    <Button type="link" onClick={onClose}>
                        <Text state={ColorStatus.error}>
                            <Icon data-testid="progress-bar-close-icon" icon={closeIcon} size={4} />
                        </Text>
                    </Button>
                )}
            </StyledProgressBarContainer>
        </StyledComponentContainer>
    );
}
