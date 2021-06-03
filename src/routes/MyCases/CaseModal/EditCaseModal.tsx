import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import { Row, Form } from "antd";
import { InputWrapper } from "../../../components/Input/styles";
import Space from "../../../components/Space";
import Input from "../../../components/Input";
import Title from "../../../components/Typography/Title";
import Text from "../../../components/Typography/Text";
import Modal from "../../../components/Modal";
import Button from "../../../components/Button";
import ColorStatus from "../../../types/ColorStatus";
import * as CONSTANTS from "../../../constants/cases";
import { useEditCase } from "../../../hooks/cases/hooks";
import useFloatingAlertContext from "../../../hooks/useFloatingAlertContext";
import Alert from "../../../components/Alert";

interface IModalProps {
    open: boolean;
    handleClose: () => void;
    noStep2?: boolean;
    setCase?: Dispatch<SetStateAction<string>>;
    currentCase: { name: string; caseNumber: string; id: string };
    fetchCases: () => void;
    data?: any;
}

const EditCaseModal = ({ open, handleClose, currentCase, fetchCases }: IModalProps) => {
    const INITIAL_STATE = {
        name: "",
        caseNumber: "",
    };

    const [step, setStep] = useState(1);
    const [formState, setFormState] = useState(INITIAL_STATE);
    const caseNameErrorMessage = !formState.name && "Please enter case name";
    const [editCase, editCaseLoading, editCaseError, editCaseData] = useEditCase();

    const addFloatingAlert = useFloatingAlertContext();

    const handleCloseAndRedirect = useCallback(() => {
        handleClose();
        setStep(1);
    }, [handleClose]);

    useEffect(() => {
        if (editCaseData) {
            const args = {
                message: CONSTANTS.EDIT_CASE_SUCCESSFUL,
                type: "success",
                duration: 3,
            };
            addFloatingAlert(args);
            handleCloseAndRedirect();
            fetchCases();
        }
    }, [fetchCases, handleCloseAndRedirect, editCaseData, addFloatingAlert]);

    useEffect(() => {
        setFormState({
            name: currentCase?.name,
            caseNumber: currentCase?.caseNumber,
        });
    }, [open, currentCase]);

    return (
        <>
            <Modal destroyOnClose visible={open} centered onlyBody onCancel={handleCloseAndRedirect}>
                {step === 1 ? (
                    <div>
                        <Space direction="vertical" size="large" fullWidth>
                            <Space.Item fullWidth>
                                <Title dataTestId="edit_case_modal" level={4} weight="light" noMargin>
                                    {CONSTANTS.EDIT_CASE_MODAL_TITLE}
                                </Title>
                                <Text state={ColorStatus.disabled} ellipsis={false}>
                                    {CONSTANTS.EDIT_CASE_MODAL_SUBTITLE}
                                </Text>
                            </Space.Item>
                            <Space.Item fullWidth>
                                <Form onFinish={() => setStep(2)} layout="vertical">
                                    <Form.Item label="Name" htmlFor="case-name">
                                        <InputWrapper>
                                            <Input
                                                value={formState.name}
                                                onChange={(e) =>
                                                    setFormState({
                                                        ...formState,
                                                        name: e.target.value,
                                                    })
                                                }
                                                placeholder="Type case name"
                                                maxLength={50}
                                                name="case-name"
                                            />
                                            <Text size="small" state={ColorStatus.error}>
                                                {caseNameErrorMessage}
                                            </Text>
                                        </InputWrapper>
                                    </Form.Item>
                                    <Form.Item label="Number (optional)" htmlFor="case-number">
                                        <InputWrapper>
                                            <Input
                                                value={formState.caseNumber}
                                                onChange={(e) =>
                                                    setFormState({
                                                        ...formState,
                                                        caseNumber: e.target.value,
                                                    })
                                                }
                                                placeholder="Type case number"
                                                maxLength={50}
                                                name="case-number"
                                            />
                                        </InputWrapper>
                                    </Form.Item>
                                    <Row justify="end">
                                        <Space size="large">
                                            <Button type="text" onClick={handleCloseAndRedirect}>
                                                {CONSTANTS.EDIT_CASE_MODAL_CANCEL}
                                            </Button>
                                            <Button
                                                data-testid="Edit case"
                                                htmlType="submit"
                                                type="primary"
                                                disabled={!formState?.name?.length}
                                            >
                                                {CONSTANTS.EDIT_CASE_MODAL_CONFIRM}
                                            </Button>
                                        </Space>
                                    </Row>
                                </Form>
                            </Space.Item>
                        </Space>
                    </div>
                ) : (
                    <div>
                        <Space direction="vertical" size="large" fullWidth>
                            <Space.Item fullWidth>
                                {editCaseError && <Alert message={CONSTANTS.NETWORK_ERROR} type="error" />}
                                <Title level={4} weight="light" data-testid="confirm_title">
                                    {CONSTANTS.EDIT_CASE_CONFIRM_TITLE}
                                </Title>
                                <Text state={ColorStatus.disabled} ellipsis={false} data-testid="confirm-subtitle">
                                    {CONSTANTS.EDIT_CASE_CONFIRM_SUB_TITLE}
                                </Text>
                            </Space.Item>
                            <Space.Item fullWidth>
                                <Row justify="end">
                                    <Space size="large">
                                        <Button
                                            data-testid="cancel_edit_case"
                                            type="text"
                                            loading={editCaseLoading}
                                            disabled={editCaseLoading}
                                            onClick={handleCloseAndRedirect}
                                        >
                                            {CONSTANTS.EDIT_CASE_CONFIRM_NEGATIVE}
                                        </Button>
                                        <Button
                                            data-testid="confirm_edit_case"
                                            type="primary"
                                            loading={editCaseLoading}
                                            disabled={editCaseLoading}
                                            onClick={() => {
                                                editCase(currentCase.id, {
                                                    name: formState.name,
                                                    caseNumber: formState.caseNumber,
                                                });
                                            }}
                                        >
                                            {CONSTANTS.EDIT_CASE_CONFIRM_POSITIVE}
                                        </Button>
                                    </Space>
                                </Row>
                            </Space.Item>
                        </Space>
                    </div>
                )}
            </Modal>
        </>
    );
};
export default EditCaseModal;
