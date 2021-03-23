import React, { memo, useRef, useState, useContext, useCallback } from "react";
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

const StyledHiddenInput = styled.input`
    opacity: 0;
    padding: 0;
    margin: 0;
    border: 0;
    position: absolute;
    z-index: -1;
`;

const CopyLink = ({ closePopOver, link }: { closePopOver: () => void; link: string }) => {
    const themeContext = useContext(ThemeContext);
    const refHiddenInput = useRef(null);
    const [copyDone, setCopyDone] = useState(false);
    const [copyError, setCopyError] = useState(false);

    const copyToClipboard = () => {
        if (copyDone) return;
        if (copyError) setCopyError(false);
        try {
            refHiddenInput.current.select();
            document.execCommand("copy");
            setCopyDone(true);
        } catch (error) {
            setCopyError(true);
        }
    };

    const resetCopyState = useCallback(() => setCopyDone(false), []);
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
            <StyledHiddenInput ref={refHiddenInput} value={link} readOnly data-testid="hidden-input" />
            {copyDone && (
                <Alert
                    onClose={resetCopyState}
                    fullWidth={false}
                    message={COPY_LINK_SUCCESS_MSG}
                    closable
                    type="success"
                    float
                    showIcon={false}
                    duration={COPY_LINK_ALERT_DURATION}
                    data-testid="copy-link-success-alert"
                />
            )}
            {copyError && (
                <Alert
                    fullWidth={false}
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
