import React, { memo, useCallback, useRef, useState } from "react";
import styled from "styled-components";
import Title from "../../Typography/Title";
import Text from "../../Typography/Text";
import Icon from "../../Icon";
import { ReactComponent as CloseIcon } from "../../../assets/icons/close.svg";
import { ReactComponent as CopyIcon } from "../../../assets/icons/copy.svg";
import Button from "../../Button";
import Alert from "../../Alert";
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

const StyledPopOverContent = styled.div`
    ${({ theme }) => `
        padding: ${getREM(theme.default.spaces[7] * 2)} ${getREM(theme.default.spaces[8] * 2)};
        min-width: ${getREM(theme.default.menuWith.default)};

        h5 {
            font-size: ${getREM(theme.default.fontSizes[5])};
            padding-bottom: ${getREM(theme.default.spaces[8])};
            margin-bottom: ${getREM(theme.default.spaces[8])};
            border-bottom: 1px solid ${theme.colors.neutrals[3]};
            font-weight: 300;
        }

        button {
            margin-top: ${getREM(theme.default.spaces[3])};
        }

        .hidden-text-to-copy {
          position: absolute;
          height: 0;
          width: 0;
          opacity: 0;
        }

        .copy-icon {
          font-size: ${getREM(theme.default.fontSizes[5])}
        }

        .close-icon {
            position: absolute;
            top: ${getREM(theme.default.spaces[7])};
            right: ${getREM(theme.default.spaces[7])};
            font-size: ${getREM(theme.default.fontSizes[4])};
            
            svg {
                path {
                    fill: ${theme.colors.secondary[5]};

                }
            }
    `}
`;

const CopyLink = ({ closePopOver, link }: { closePopOver: () => void; link: string }) => {
    const refTextarea = useRef(null);
    const [copyDone, setCopyDone] = useState(false);
    const [copyError, setCopyError] = useState(false);
    const resetTimeOut = COPY_LINK_ALERT_DURATION * 1000;
    const copyToClipboard = useCallback(() => {
        if (copyDone) return;
        try {
            refTextarea.current.select();
            document.execCommand("copy");

            setCopyError(false);
        } catch (error) {
            setCopyError(true);
        }
        setCopyDone(true);
        setTimeout(() => setCopyDone(false), resetTimeOut);
    }, [copyDone, resetTimeOut]);

    return (
        <StyledPopOverContent>
            <Icon className="close-icon" icon={CloseIcon} onClick={closePopOver} data-testid="close-button" />
            <Title level={5}>{COPY_LINK_TITLE}</Title>
            <Text state={ColorStatus.disabled}>{COPY_LINK_DESCRIPTION}</Text>
            <Button
                type="link"
                icon={<Icon icon={CopyIcon} className="copy-icon" />}
                onClick={copyToClipboard}
                data-testid="copy-button"
            >
                {COPY_LINK_BUTTON}
            </Button>
            <textarea
                ref={refTextarea}
                value={link}
                readOnly
                className="hidden-text-to-copy"
                data-testid="hidden-textarea"
            />
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
        </StyledPopOverContent>
    );
};
export default memo(CopyLink);
