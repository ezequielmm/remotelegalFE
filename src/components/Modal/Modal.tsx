import React from "react";
import { Modal as AntModal } from "antd";
import { ModalProps } from "antd/lib/modal/Modal";

import styled from "styled-components";
import { theme } from "../../constants/styles/theme";
import { getREM } from "../../constants/styles/utils";
import { ReactComponent as CloseIcon } from "../../assets/icons/close.svg";
import Icon from "../Icon";

export enum ModalSize {
    "default" = "default",
    "small" = "small",
    "large" = "large",
}

export interface IModalProps extends ModalProps {
    onlyBody?: boolean;
    children?: React.ReactNode;
    size?: ModalSize;
}

const modalDefault = ({ children, ...rest }: IModalProps) => {
    return <AntModal {...rest}>{children}</AntModal>;
};

const StyledModal = styled(modalDefault)<IModalProps>`
    ${({ onlyBody, size, theme: styledTheme }) => {
        const stylesOnlyBody = onlyBody
            ? `
            .ant-modal-body {
                padding: ${getREM(theme.default.spaces[6] * 4)} ${getREM(theme.default.spaces[6] * 5)};
            }

            @media (max-width: ${theme.default.breakpoints.sm}) {
                .ant-modal-body {
                    padding: ${styledTheme.default.spaces[12]}rem;
                }
            }
            `
            : "";

        const sizeStyles =
            size === ModalSize.small
                ? `
                    .ant-modal-body {
                        padding: ${getREM(theme.default.spaces[9] * 2)};
                    }
                `
                : "";

        const styles = `
            ${stylesOnlyBody}
            ${sizeStyles}
            `;

        return styles;
    }}
`;

const modal = ({ children, onlyBody, width, size = ModalSize.default, ...rest }: IModalProps) => {
    const footer = onlyBody ? null : rest.footer;
    const closeIcon = <Icon icon={CloseIcon} size={9} />;

    return (
        <StyledModal
            onlyBody={onlyBody}
            footer={footer}
            closeIcon={closeIcon}
            size={size}
            {...rest}
            width={width || theme.default.modalWidth[size]}
        >
            {children}
        </StyledModal>
    );
};

export default modal;
