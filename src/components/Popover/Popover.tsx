import React from "react";
import styled from "styled-components";
import { Popover as ANTPopover } from "antd";
import { PopoverProps } from "antd/lib/popover";
import Icon from "../Icon";
import { ReactComponent as CloseIcon } from "../../assets/icons/close.svg";
import { getREM } from "../../constants/styles/utils";
import { ThemeMode } from "../../types/ThemeType";

export interface IPopoverProps extends Omit<PopoverProps, "content, title"> {
    $hasPadding?: boolean;
    dataTestId?: string;
    closable?: boolean;
    onClose?: () => void;
}

const StyledPopoverContainer = styled.div<Pick<IPopoverProps, "$hasPadding" | "dataTestId" | "closable">>`
    ${({ $hasPadding, closable, theme }) => {
        const { colors } = theme;

        const hasPaddingStyles = $hasPadding
            ? `
            .ant-popover-inner-content {
                padding: ${getREM(theme.default.spaces[6])} ${getREM(theme.default.spaces[9])};
            }
            `
            : `
            .ant-popover-inner-content {
                padding: 0;
            }
        `;

        const closableStyles = closable
            ? `
            .ant-popover-inner-content {
                padding-right: 2.5rem;
            }
            `
            : "";

        const inDepoStyles =
            theme.mode === ThemeMode.inDepo
                ? `
                .ant-popover-inner {
                    background-color: ${colors.inDepoNeutrals[0]};
                }
                .ant-popover-placement-top, .ant-popover-placement-topLeft, .ant-popover-placement-topRight {
                    .ant-popover-arrow {
                        border-color: transparent ${colors.inDepoNeutrals[0]} ${colors.inDepoNeutrals[0]} transparent;
                    }
                }
                .ant-popover-placement-right, .ant-popover-placement-rightTop, .ant-popover-placement-rightBottom {
                    .ant-popover-arrow {
                        border-color: transparent transparent ${colors.inDepoNeutrals[0]} ${colors.inDepoNeutrals[0]};
                    }
                }
                .ant-popover-placement-bottom, .ant-popover-placement-bottomLeft, .ant-popover-placement-bottomRight {
                    .ant-popover-arrow {
                        border-color: ${colors.inDepoNeutrals[0]} transparent transparent ${colors.inDepoNeutrals[0]};
                    }
                }
                .ant-popover-placement-left, .ant-popover-placement-leftTop, .ant-popover-placement-leftBottom {
                    .ant-popover-arrow {
                        border-color: ${colors.inDepoNeutrals[0]} ${colors.inDepoNeutrals[0]} transparent transparent;
                    }
                }
                `
                : "";

        const styles = `
            .ant-popover-inner-content {
                min-width: ${getREM(theme.default.spaces[6] * 12)};
                max-width: ${getREM(theme.default.spaces[6] * 20)};
            }
            ${hasPaddingStyles}
            ${closableStyles}
            ${inDepoStyles}
        `;
        return styles;
    }}
`;

const StyledCloseIcon = styled(Icon)`
    position: absolute;
    top: ${({ theme }) => getREM(theme.default.spaces[3])};
    right: ${({ theme }) => getREM(theme.default.spaces[3])};
    font-size: ${({ theme }) => getREM(theme.default.fontSizes[3])};
    color: ${({ theme }) => theme.default.disabledColor};
`;

const Popover = ({
    children,
    overlay,
    closable = false,
    onClose,
    $hasPadding = true,
    dataTestId,
    ...props
}: IPopoverProps) => {
    return (
        <StyledPopoverContainer data-testid={dataTestId} $hasPadding={$hasPadding} closable={closable}>
            <ANTPopover
                content={() =>
                    closable ? (
                        <div>
                            <StyledCloseIcon icon={CloseIcon} onClick={onClose} data-testid="close-button" />
                            {overlay}
                        </div>
                    ) : (
                        overlay
                    )
                }
                getPopupContainer={(trigger) => trigger.parentElement}
                {...props}
            >
                {children}
            </ANTPopover>
        </StyledPopoverContainer>
    );
};

export default Popover;
