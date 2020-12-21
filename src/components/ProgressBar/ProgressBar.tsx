import React, { ReactElement } from "react";
import Text from "../Typography/Text";
import Icon from "../Icon";
import Button from "../Button";
import { ReactComponent as attachIcon } from "../../assets/icons/attach-clip.svg";
import { ReactComponent as closeIcon } from "../../assets/icons/close.svg";
import { StyledProgressBarHeader, StyledProgressBar, StyledProgressBarContainer } from "./styles";
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
        <>
            <StyledProgressBarHeader>
                <Icon icon={attachIcon} style={{ fontSize: "16px" }} />
                <Text state="primary">{statusText}</Text>
            </StyledProgressBarHeader>
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
                        <Icon
                            data-testid="progress-bar-close-icon"
                            icon={closeIcon}
                            style={{ fontSize: "16px" }}
                            className="close-icon"
                        />
                    </Button>
                )}
            </StyledProgressBarContainer>
        </>
    );
}
