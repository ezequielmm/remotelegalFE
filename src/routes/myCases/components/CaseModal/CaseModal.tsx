import React from "react";
import { Space, Row, Form, Result, Alert } from "antd";
import useInput from "../../../../hooks/useInput";
import isInputEmpty from "../../../../helpers/isInputEmpty";
import { InputWrapper } from "../../../../components/Input/styles";
import Input from "../../../../components/Input";
import Title from "../../../../components/Typography/Title";
import Text from "../../../../components/Typography/Text";
import useFetch from "../../../../hooks/useFetch";
import buildRequestOptions from "../../../../helpers/buildRequestOptions";
import Modal from "../../../../components/Modal";
import Button from "../../../../components/Button";

interface IModalProps {
    open: boolean;
    handleClose: () => void;
    fetchCases: () => void;
}

const CaseModal = ({ open, handleClose, fetchCases }: IModalProps) => {
    const [caseNumber, setCaseNumber] = React.useState("");
    const { inputValue: caseNameValue, input: caseNameInput, invalid: caseNameInvalid, setValue } = useInput(
        isInputEmpty,
        {
            name: "case-title",
            placeholder: "Type a case name",
            maxLength: 100,
        }
    );
    const caseNameErrorMessage = caseNameInvalid && "Please enter a case name";
    const requestObj = buildRequestOptions("POST", {
        name: caseNameValue,
        caseNumber,
    });
    const NETWORK_ERROR = "Something went wrong. Please try again.";
    const { error, data, loading, fetchAPI, setData } = useFetch(
        `${process.env.REACT_APP_BASE_BE_URL}/api/Cases`,
        requestObj
    );

    const handleCloseAndRedirect = () => {
        if (loading) {
            return;
        }
        if (data) {
            if (caseNumber.length) {
                setCaseNumber("");
            }
            fetchCases();
            setData(null);
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
            <div tabIndex={-1} onKeyDown={handleKeyDownEvent}>
                {data ? (
                    /* TODO: ADD STYLES */
                    <Result
                        status="success"
                        title="Your case has been added successfully!"
                        subTitle="You can now start adding files, collaborators and depositions to this case"
                        extra={[
                            <Button
                                key="new_case_button"
                                data-testid="new_case_button"
                                style={{ display: "block", margin: "0 auto" }}
                                type="primary"
                                onClick={handleCloseAndRedirect}
                            >
                                Go to my cases
                            </Button>,
                        ]}
                    />
                ) : (
                    <Space direction="vertical" size="large" style={{ width: "100%" }}>
                        <div>
                            <Title level={4} weight="light" noMargin>
                                Add a case
                            </Title>
                            <Text state="disabled" ellipsis={false}>
                                To add a case, please complete the information below.
                            </Text>
                        </div>
                        {error && <Alert message={NETWORK_ERROR} type="error" showIcon />}
                        <div>
                            <Form onFinish={fetchAPI} layout="vertical">
                                <Form.Item label="Case Title" htmlFor="case-title">
                                    <InputWrapper>
                                        {caseNameInput}
                                        <Text size="small" state="error">
                                            {caseNameErrorMessage}
                                        </Text>
                                    </InputWrapper>
                                </Form.Item>
                                <Form.Item label="Case Number (optional)" htmlFor="casenumber">
                                    <InputWrapper>
                                        <Input
                                            value={caseNumber}
                                            onChange={(e) => setCaseNumber(e.target.value)}
                                            placeholder="Type a case number"
                                            maxLength={50}
                                            name="casenumber"
                                        />
                                    </InputWrapper>
                                </Form.Item>
                                <Row justify="end">
                                    <Space size="large">
                                        <Button type="text" disabled={loading} onClick={handleClose}>
                                            Cancel
                                        </Button>
                                        <Button
                                            htmlType="submit"
                                            onClick={() => fetchAPI()}
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
