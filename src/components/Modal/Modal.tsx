import React from "react";
import { Modal as AntModal } from "antd";
import { ModalProps } from "antd/lib/modal/Modal";

import styled from "styled-components";
import { theme } from "../../constants/styles/theme";
import { getREM } from "../../constants/styles/utils";
import { ReactComponent as CloseIcon } from "../../assets/icons/close.svg";
import Icon from "../Icon";

export interface IModalProps extends ModalProps {
    onlyBody?: boolean;
    children?: React.ReactNode;
}

const modalDefault = ({ children, ...rest }: IModalProps) => {
    return <AntModal {...rest}>{children}</AntModal>;
};

const StyledModal = styled(modalDefault)<IModalProps>`
    ${({ onlyBody, theme: styledTheme }) => {
        const stylesOnlyBody = onlyBody
            ? `
            .ant-modal-body {
                padding: ${getREM(theme.default.spaces[6] * 4)} ${getREM(theme.default.spaces[6] * 5)};
            }

            @media (max-width: 576px) {
                .ant-modal-body {
                    padding: ${styledTheme.default.spaces[12]}rem;
                }
            }
            `
            : "";

        const styles = `
            ${stylesOnlyBody}
            `;

        return styles;
    }}
`;

const modal = (props: IModalProps) => {
    const { children, onlyBody, ...rest } = props;
    const footer = onlyBody ? null : rest.footer;
    const closeIcon = <Icon icon={CloseIcon} />;

    return (
        <StyledModal
            onlyBody={onlyBody}
            footer={footer}
            closeIcon={closeIcon}
            {...rest}
            width={theme.default.baseUnit * 38}
        >
            {children}
        </StyledModal>
    );
};

export default modal;
