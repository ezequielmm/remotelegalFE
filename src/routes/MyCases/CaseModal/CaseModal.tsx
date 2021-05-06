import React, { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { Row, Form } from "antd";
import useInput from "../../../hooks/useInput";
import isInputEmpty from "../../../helpers/isInputEmpty";
import { InputWrapper } from "../../../components/Input/styles";
import Space from "../../../components/Space";
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
import Message from "../../../components/Message";

interface IModalProps {
    open: boolean;
    handleClose: () => void;
    fetchCases: () => void;
    noStep2?: boolean;
    setCase?: Dispatch<SetStateAction<string>>;
}

const CaseModal = ({ open, handleClose, fetchCases, noStep2, setCase }: IModalProps) => {
    const [caseNumber, setCaseNumber] = React.useState("");
    const [displaySuccess, setDisplaySuccess] = React.useState(false);
    const elementRef = useRef(null);
    const newCaseCreated = useRef(false);
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
        if (data && !noStep2) {
            newCaseCreated.current = true;
            setDisplaySuccess(true);
            if (elementRef.current) elementRef.current.focus();
        }
        if (data && noStep2) {
            fetchCases();
            setCaseNumber("");
            setValue("");
            Message({
                content: "The case was successfully created!",
                type: "success",
                duration: 3,
            });
            setCase(data.id);
            handleClose();
        }
    }, [data, noStep2, handleClose, setCase, setValue, fetchCases]);

    const resetState = () => {
        if (caseNameValue) {
            setValue("");
        }
        if (caseNumber) {
            setCaseNumber("");
        }
        if (displaySuccess) {
            setDisplaySuccess(false);
        }
        newCaseCreated.current = false;
    };

    const handleCloseAndRedirect = () => {
        if (loading) {
            return;
        }

        if (newCaseCreated.current) {
            fetchCases();
        }
        resetState();
        handleClose();
    };

    return (
        <Modal destroyOnClose visible={open} centered onlyBody onCancel={handleCloseAndRedirect}>
            <div>
                {displaySuccess && !noStep2 ? (
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
                    <Space direction="vertical" size="large" fullWidth>
                        <Space.Item fullWidth>
                            <Title dataTestId="add_new_case_modal" level={4} weight="light" noMargin>
                                Add case
                            </Title>
                            <Text state={ColorStatus.disabled} ellipsis={false}>
                                Please complete the information below.
                            </Text>
                        </Space.Item>
                        {error && <Alert message={NETWORK_ERROR} type="error" />}
                        <Space.Item fullWidth>
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
                                        <Button type="text" disabled={loading} onClick={handleCloseAndRedirect}>
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
                        </Space.Item>
                    </Space>
                )}
            </div>
        </Modal>
    );
};
export default CaseModal;
