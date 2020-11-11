import React from "react";
import { Modal as AntModal } from "antd";
import { ModalProps } from "antd/lib/modal/Modal";

import styled from "styled-components";
import { theme } from "../../constants/styles/theme";
import { getREM } from "../../constants/styles/utils";

export interface IModalProps extends ModalProps {
    onlyBody?: boolean;
    children: React.ReactNode;
}

const modalDefault = ({ children, ...rest }: IModalProps) => {
    return <AntModal {...rest}>{children}</AntModal>;
};

const StyledModal = styled(modalDefault)<IModalProps>`
    ${({ onlyBody, theme }) => {
        const stylesOnlyBody = onlyBody
            ? `
            width: 38rem;
            .ant-modal-body {
                padding: ${getREM(theme.default.spaces[11])} ${getREM(theme.default.spaces[12])};
            }

            @media (max-width: 576px) {
                .ant-modal-body {
                    padding: ${theme.default.spaces[7]}rem;
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

    return (
        <StyledModal onlyBody={onlyBody} footer={footer} {...rest} width={theme.default.baseUnit * 38}>
            {children}
        </StyledModal>
    );
};

export default modal;
