import React from "react";
import { Col, Row, Alert, Space } from "antd";
import { NETWORK_ERROR } from "../constants/errors";
import useFetch from "../../../hooks/useFetch";
import buildRequestOptions from "../../../helpers/buildRequestOptions";
import Title from "../../../components/Typography/Title";
import Text from "../../../components/Typography/Text";
import { StyledButtonLink } from "./components";
import { theme } from "../../../constants/styles/theme";

interface CodeSentProps {
    email: string;
}
const CodeSent = ({ email }: CodeSentProps) => {
    const requestObj = buildRequestOptions("POST", {
        emailAddress: email,
    });
    const { error, loading, fetchAPI } = useFetch(
        `${process.env.REACT_APP_BASE_BE_URL}/api/Users/resendVerificationEmail`,
        requestObj,
        false
    );

    const handleLinkFetch = () => {
        if (loading) {
            return;
        }
        fetchAPI();
    };
    return (
        <>
            <Row justify="center">
                <Space direction="vertical" size={theme.default.spaces[11] * theme.default.baseUnit}>
                    {error && <Alert message={NETWORK_ERROR} type="error" showIcon />}
                    <Col style={{ textAlign: "center" }}>
                        <Title level={3} weight="light" noMargin>
                            Check your mailbox
                        </Title>
                        <Title level={4} weight="light">
                            {email}
                        </Title>
                    </Col>
                    <Space size="small" align="start">
                        <Text size="extralarge" state="disabled">
                            Didn’t get the email?
                        </Text>
                        <StyledButtonLink type="link" onClick={handleLinkFetch}>
                            Click here to resend it
                        </StyledButtonLink>
                    </Space>
                </Space>
            </Row>
        </>
    );
};
export default CodeSent;
