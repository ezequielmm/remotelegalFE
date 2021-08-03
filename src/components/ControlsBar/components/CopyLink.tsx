import React, { memo, useRef, useState, useContext, useCallback, useEffect } from "react";
import styled, { ThemeContext, ThemeProvider } from "styled-components";
import { Divider } from "antd";
import Button from "prp-components-library/src/components/Button";
import Card from "prp-components-library/src/components/Card";
import Icon from "prp-components-library/src/components/Icon";
import Space from "prp-components-library/src/components/Space";
import Text from "prp-components-library/src/components/Text";
import Title from "prp-components-library/src/components/Title";
import Drawer from "prp-components-library/src/components/Drawer";
import { ReactComponent as CloseIcon } from "../../../assets/icons/close.svg";
import { ReactComponent as CopyIcon } from "../../../assets/icons/copy.svg";
import { getREM } from "../../../constants/styles/utils";
import ColorStatus from "../../../types/ColorStatus";
import useFloatingAlertContext from "../../../hooks/useFloatingAlertContext";
import useWindowSize from "../../../hooks/useWindowSize";
import { ThemeMode } from "../../../types/ThemeType";
import {
    COPY_LINK_DESCRIPTION,
    COPY_LINK_TITLE,
    COPY_LINK_BUTTON,
    COPY_LINK_ERROR_MSG,
    COPY_LINK_SUCCESS_MSG,
    COPY_LINK_ALERT_DURATION,
} from "../../../constants/inDepo";
import { theme } from "../../../constants/styles/theme";

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

const StyledCopyLinkwrapper = styled.div`
    padding-top: ${({ theme }) => getREM(theme.default.spaces[3])};
    .ant-divider-horizontal {
        margin: ${({ theme }) => getREM(theme.default.spaces[6])} 0;
    }
`;

interface CopyLinkwrapperProps {
    children?: React.ReactNode;
    closePopOver: () => void;
    drawerOpen?: boolean;
}
interface CopyLinkProps {
    closePopOver: () => void;
    link: string;
    summaryOpen?: boolean;
}

const CopyLinkWrapper = ({ children, closePopOver, drawerOpen }: CopyLinkwrapperProps) => {
    const [windowWidth] = useWindowSize();
    const widthMorethanLg = windowWidth >= parseInt(theme.default.breakpoints.lg, 10);
    return (
        <>
            {widthMorethanLg ? (
                <Card bg={ColorStatus.white}>
                    <StyledCloseIcon icon={CloseIcon} onClick={closePopOver} data-testid="close-button" />
                    {children}
                </Card>
            ) : (
                <ThemeProvider theme={{ ...theme, mode: ThemeMode.default }}>
                    <Drawer visible={drawerOpen} onClose={closePopOver} placement="bottom" height="100%">
                        <StyledCopyLinkwrapper>{children}</StyledCopyLinkwrapper>
                    </Drawer>
                </ThemeProvider>
            )}
        </>
    );
};

const CopyLink = ({ closePopOver, link, summaryOpen }: CopyLinkProps) => {
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

    const addAlert = useFloatingAlertContext();

    useEffect(() => {
        if (copyDone) {
            addAlert({
                message: COPY_LINK_SUCCESS_MSG,
                onClose: resetCopyState,
                closable: true,
                type: "success",
                showIcon: false,
                duration: COPY_LINK_ALERT_DURATION,
                dataTestId: "copy-link-success-alert",
            });
        }
        if (copyError) {
            addAlert({
                message: COPY_LINK_ERROR_MSG,
                type: "error",
                showIcon: false,
                duration: COPY_LINK_ALERT_DURATION,
                dataTestId: "copy-link-error-alert",
            });
        }
    }, [copyDone, resetCopyState, copyError, addAlert]);

    return (
        <CopyLinkWrapper closePopOver={closePopOver} drawerOpen={summaryOpen}>
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
        </CopyLinkWrapper>
    );
};

export default memo(CopyLink);
