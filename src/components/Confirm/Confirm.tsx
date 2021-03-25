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
import ColorStatus from "../../types/ColorStatus";

export interface IConfirmProps extends IModalProps {
    title?: string;
    subTitle?: string;
    positiveLabel?: string;
    negativeLabel?: string;
    onCancelClick?: () => void;
    onNegativeClick?: () => void;
    onPositiveClick?: () => void;
    positiveLoading?: boolean;
    negativeLoading?: boolean;
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
    const {
        title,
        subTitle,
        onCancelClick,
        onNegativeClick,
        onPositiveClick,
        negativeLabel,
        positiveLabel,
        children,
        positiveLoading,
        negativeLoading,
        ...rest
    } = props;
    const closeIcon = <Icon icon={CloseIcon} size={9} />;
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
                    {!!negativeLabel && (
                        <Button
                            data-testid="confirm_negative_button"
                            type="text"
                            loading={negativeLoading}
                            disabled={positiveLoading}
                            onClick={onNegativeClick}
                        >
                            {negativeLabel}
                        </Button>
                    )}
                    {positiveLabel && (
                        <Button
                            data-testid="confirm_positive_button"
                            type="primary"
                            loading={positiveLoading}
                            disabled={negativeLoading}
                            onClick={onPositiveClick}
                        >
                            {positiveLabel}
                        </Button>
                    )}
                </>
            }
        >
            <Title level={4} weight="light" data-testid="confirm_title">
                {title}
            </Title>
            <Text state={ColorStatus.disabled} ellipsis={false} data-testid="confirm-subtitle">
                {subTitle}
            </Text>
            {children}
        </ConfirmModal>
    );
};

export default confirm;
