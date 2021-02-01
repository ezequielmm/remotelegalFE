import React, { memo, useCallback, useRef, useState, useContext } from "react";
import styled, { ThemeContext } from "styled-components";
import { Divider } from "antd";
import Title from "../../Typography/Title";
import Text from "../../Typography/Text";
import Button from "../../Button";
import Alert from "../../Alert";
import Card from "../../Card";
import Space from "../../Space";
import Icon from "../../Icon";
import { ReactComponent as CloseIcon } from "../../../assets/icons/close.svg";
import { ReactComponent as CopyIcon } from "../../../assets/icons/copy.svg";
import { getREM } from "../../../constants/styles/utils";
import ColorStatus from "../../../types/ColorStatus";
import {
    COPY_LINK_DESCRIPTION,
    COPY_LINK_TITLE,
    COPY_LINK_BUTTON,
    COPY_LINK_ERROR_MSG,
    COPY_LINK_SUCCESS_MSG,
    COPY_LINK_ALERT_DURATION,
} from "../../../constants/inDepo";

const StyledCloseIcon = styled(Icon)`
    position: absolute;
    top: ${({ theme }) => getREM(theme.default.spaces[6])};
    right: ${({ theme }) => getREM(theme.default.spaces[6])};
    font-size: ${({ theme }) => getREM(theme.default.fontSizes[3])};
    color: ${({ theme }) => theme.colors.secondary[5]};
`;

const CopyLink = ({ closePopOver, link }: { closePopOver: () => void; link: string }) => {
    const themeContext = useContext(ThemeContext);
    const refHiddenInput = useRef(null);
    const [copyDone, setCopyDone] = useState(false);
    const [copyError, setCopyError] = useState(false);
    const resetTimeOut = COPY_LINK_ALERT_DURATION * 1000;
    const copyToClipboard = useCallback(() => {
        if (copyDone) return;
        try {
            refHiddenInput.current.select();
            document.execCommand("copy");

            setCopyError(false);
        } catch (error) {
            setCopyError(true);
        }
        setCopyDone(true);
        setTimeout(() => setCopyDone(false), resetTimeOut);
    }, [copyDone, resetTimeOut]);

    return (
        <Card bg={ColorStatus.white}>
            <StyledCloseIcon icon={CloseIcon} onClick={closePopOver} data-testid="close-button" />
            <Title level={6} weight="light">
                {COPY_LINK_TITLE}
            </Title>
            <Divider />
            <Space mb={3}>
                <Text state={ColorStatus.disabled}>{COPY_LINK_DESCRIPTION}</Text>
            </Space>
            <Button
                type="link"
                icon={<Icon icon={CopyIcon} style={{ fontSize: getREM(themeContext.default.fontSizes[5]) }} />}
                onClick={copyToClipboard}
                data-testid="copy-button"
            >
                {COPY_LINK_BUTTON}
            </Button>
            <input ref={refHiddenInput} value={link} readOnly type="hidden" data-testid="hidden-input" />
            {copyDone && !copyError && (
                <Alert
                    message={COPY_LINK_SUCCESS_MSG}
                    type="success"
                    float
                    showIcon={false}
                    duration={COPY_LINK_ALERT_DURATION}
                    data-testid="copy-link-success-alert"
                />
            )}
            {copyDone && copyError && (
                <Alert
                    message={COPY_LINK_ERROR_MSG}
                    type="error"
                    float
                    showIcon={false}
                    duration={COPY_LINK_ALERT_DURATION}
                    data-testid="copy-link-error-alert"
                />
            )}
        </Card>
    );
};

export default memo(CopyLink);
