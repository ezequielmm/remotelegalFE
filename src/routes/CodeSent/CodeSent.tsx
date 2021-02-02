import React from "react";
import { Col, Row } from "antd";
import { NETWORK_ERROR } from "../../constants/codeSent";
import { useVerifyEmail } from "../../hooks/auth";
import Space from "../../components/Space";
import Alert from "../../components/Alert";
import Title from "../../components/Typography/Title";
import Text from "../../components/Typography/Text";
import { StyledButtonLink } from "./styles";
import { theme } from "../../constants/styles/theme";
import ColorStatus from "../../types/ColorStatus";
import { getREM } from "../../constants/styles/utils";

interface CodeSentProps {
    email: string;
}
const CodeSent = ({ email }: CodeSentProps) => {
    const { error, loading, verifyEmail } = useVerifyEmail(email);

    const handleLinkFetch = () => {
        if (loading) {
            return;
        }
        verifyEmail();
    };
    return (
        <Row justify="center">
            <Space direction="vertical" size={`${getREM(theme.default.spaces[6] * 4)}`}>
                {error && <Alert data-testid={error} message={NETWORK_ERROR} type="error" />}
                <Col style={{ textAlign: "center" }}>
                    <Title dataTestId="code_sent_title" level={3} weight="light" noMargin>
                        Check your mailbox
                    </Title>
                    <Title dataTestId="code_sent_mail" level={4} weight="light">
                        {email}
                    </Title>
                </Col>
                <Space size="small" align="flex-start">
                    <Text size="extralarge" state={ColorStatus.disabled}>
                        Didn’t get the email?
                    </Text>
                    <StyledButtonLink data-testid="code_sent_resend_link" type="link" onClick={handleLinkFetch}>
                        Click here to resend it
                    </StyledButtonLink>
                </Space>
            </Space>
        </Row>
    );
};
export default CodeSent;
