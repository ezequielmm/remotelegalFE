import React, { useEffect, useRef } from "react";
import { Space, Row, Form } from "antd";
import useInput from "../../../hooks/useInput";
import isInputEmpty from "../../../helpers/isInputEmpty";
import { InputWrapper } from "../../../components/Input/styles";
import Input from "../../../components/Input";
import Alert from "../../../components/Alert";
import Title from "../../../components/Typography/Title";
import Text from "../../../components/Typography/Text";
import { useCreateCase } from "../../../hooks/cases/hooks";
import Modal from "../../../components/Modal";
import Button from "../../../components/Button";
import Result from "../../../components/Result";
import { CustomStatus } from "../../../components/Result/Result";
import ColorStatus from "../../../types/ColorStatus";

interface IModalProps {
    open: boolean;
    handleClose: () => void;
    fetchCases: () => void;
}

const CaseModal = ({ open, handleClose, fetchCases }: IModalProps) => {
    const [caseNumber, setCaseNumber] = React.useState("");
    const [displaySuccess, setDisplaySuccess] = React.useState(false);

    const elementRef = useRef(null);
    const { inputValue: caseNameValue, input: caseNameInput, invalid: caseNameInvalid, setValue } = useInput(
        isInputEmpty,
        {
            name: "case-name",
            placeholder: "Type case name",
            maxLength: 100,
        }
    );
    const caseNameErrorMessage = caseNameInvalid && "Please enter case name";
    const NETWORK_ERROR = "Something went wrong. Please try again.";
    const [createCase, loading, error, data] = useCreateCase();

    useEffect(() => {
        if (data) {
            setDisplaySuccess(true);
            if (elementRef.current) elementRef.current.focus();
        }
    }, [data]);

    const handleCloseAndRedirect = () => {
        if (loading) {
            return;
        }
        if (data) {
            if (caseNumber.length) {
                setCaseNumber("");
            }
            fetchCases();
            setDisplaySuccess(false);
            setValue("");
        }
        handleClose();
    };
    const handleKeyDownEvent = (e) => {
        if (e.key === "Escape") {
            handleCloseAndRedirect();
        }
    };
    return (
        <Modal destroyOnClose visible={open} centered onlyBody onCancel={handleCloseAndRedirect}>
            <div ref={elementRef} tabIndex={-1} onKeyDown={handleKeyDownEvent}>
                {displaySuccess ? (
                    <Result
                        title="Your case has been added successfully!"
                        subTitle="You can now start adding files, collaborators and depositions to this case"
                        status={CustomStatus.successCreate}
                        extra={[
                            <Button
                                type="primary"
                                onClick={handleCloseAndRedirect}
                                key="new_case_button"
                                data-testid="new_case_button"
                            >
                                Go to my cases
                            </Button>,
                        ]}
                    />
                ) : (
                    <Space direction="vertical" size="large" style={{ width: "100%" }}>
                        <div>
                            <Title level={4} weight="light" noMargin>
                                Add case
                            </Title>
                            <Text state={ColorStatus.disabled} ellipsis={false}>
                                Please complete the information below.
                            </Text>
                        </div>
                        {error && <Alert message={NETWORK_ERROR} type="error" />}
                        <div>
                            <Form onFinish={() => createCase(caseNameValue, caseNumber)} layout="vertical">
                                <Form.Item label="Name" htmlFor="case-name">
                                    <InputWrapper>
                                        {caseNameInput}
                                        <Text size="small" state={ColorStatus.error}>
                                            {caseNameErrorMessage}
                                        </Text>
                                    </InputWrapper>
                                </Form.Item>
                                <Form.Item label="Number (optional)" htmlFor="case-number">
                                    <InputWrapper>
                                        <Input
                                            value={caseNumber}
                                            onChange={(e) => setCaseNumber(e.target.value)}
                                            placeholder="Type case number"
                                            maxLength={50}
                                            name="case-number"
                                        />
                                    </InputWrapper>
                                </Form.Item>
                                <Row justify="end">
                                    <Space size="large">
                                        <Button type="text" disabled={loading} onClick={handleClose}>
                                            Cancel
                                        </Button>
                                        <Button
                                            data-testid="Add case"
                                            htmlType="submit"
                                            type="primary"
                                            disabled={!caseNameValue.length || loading}
                                        >
                                            Add case
                                        </Button>
                                    </Space>
                                </Row>
                            </Form>
                        </div>
                    </Space>
                )}
            </div>
        </Modal>
    );
};
export default CaseModal;
