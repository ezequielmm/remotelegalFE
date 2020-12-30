import React from "react";
import styled from "styled-components";
import { getREM } from "../../constants/styles/utils";
import { ReactComponent as CloseIcon } from "../../assets/icons/close.svg";
import Modal from "../Modal";
import Icon from "../Icon";
import { IModalProps } from "../Modal/Modal";
import Title from "../Typography/Title";
import Text from "../Typography/Text";
import Button from "../Button";

export interface IConfirmProps extends IModalProps {
    title?: string;
    subTitle?: string;
    positiveLabel?: string;
    negativeLabel?: string;
    onNegativeClick?: () => void;
    onPositiveClick?: () => void;
}

const ConfirmModal = styled(Modal)<IConfirmProps>`
    ${({ theme }) => {
        const { spaces } = theme.default;

        const modalStyles = `
        .ant-modal-content {
            padding: ${getREM(spaces[8] * 2)};
                .ant-modal-body {
                    padding: 0;
                }
                .ant-modal-footer {
                    padding: ${getREM(spaces[8] * 2)} 0 0 0;
                    border-top: 0;
                }
            }
        `;

        const styles = `
            ${modalStyles}
        `;

        return styles;
    }}
`;

const confirm = (props: IConfirmProps) => {
    const { title, subTitle, onNegativeClick, onPositiveClick, negativeLabel, positiveLabel, ...rest } = props;
    const closeIcon = <Icon icon={CloseIcon} />;

    return (
        <ConfirmModal
            closeIcon={closeIcon}
            destroyOnClose
            onlyBody
            centered
            onCancel={onNegativeClick}
            {...rest}
            footer={
                <>
                    <Button type="text" onClick={onNegativeClick}>
                        {negativeLabel}
                    </Button>
                    <Button type="primary" onClick={onPositiveClick}>
                        {positiveLabel}
                    </Button>
                </>
            }
        >
            <Title level={4} weight="light">
                {title}
            </Title>
            <Text state="disabled" ellipsis={false}>
                {subTitle}
            </Text>
        </ConfirmModal>
    );
};

export default confirm;
