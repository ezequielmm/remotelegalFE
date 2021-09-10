import { useCallback, useEffect, useState } from "react";
import { Row, Form } from "antd";
import Button from "prp-components-library/src/components/Button";
import Alert from "prp-components-library/src/components/Alert";
import Input from "prp-components-library/src/components/Input";
import { InputWrapper } from "prp-components-library/src/components/Input/styles";
import Modal from "prp-components-library/src/components/Modal";
import Space from "prp-components-library/src/components/Space";
import Text from "prp-components-library/src/components/Text";
import Title from "prp-components-library/src/components/Title";
import ColorStatus from "../../../types/ColorStatus";
import * as CONSTANTS from "../../../constants/cases";
import { useEditCase } from "../../../hooks/cases/hooks";
import useFloatingAlertContext from "../../../hooks/useFloatingAlertContext";

interface IModalProps {
    open: boolean;
    handleClose: () => void;
    currentCase: { name: string; caseNumber: string; id: string };
    fetchCases: () => void;
}

const EditCaseModal = ({ open, handleClose, currentCase, fetchCases }: IModalProps) => {
    const INITIAL_STATE = {
        name: "",
        caseNumber: "",
    };

    const [step, setStep] = useState(1);
    const [formState, setFormState] = useState(INITIAL_STATE);
    const caseNameErrorMessage = !formState.name && "Please enter case name";
    const [editCaseErrorState, setEditCaseErrorState] = useState(null);
    const [editCase, editCaseLoading, editCaseError, editCaseData] = useEditCase();

    const addFloatingAlert = useFloatingAlertContext();

    const handleCloseAndRedirect = useCallback(() => {
        handleClose();
        setStep(1);
        setEditCaseErrorState(null);
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

    useEffect(() => {
        setEditCaseErrorState(editCaseError);
    }, [editCaseError]);

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
                                {editCaseErrorState && <Alert message={CONSTANTS.NETWORK_ERROR} type="error" />}
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
