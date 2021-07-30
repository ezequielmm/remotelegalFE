import Alert from "prp-components-library/src/components/Alert";
import Space from "prp-components-library/src/components/Space";
import Text from "prp-components-library/src/components/Text";
import Title from "prp-components-library/src/components/Title";
import { NETWORK_ERROR } from "../../constants/codeSent";
import { StyledButtonLink } from "./styles";
import { theme } from "../../constants/styles/theme";
import ColorStatus from "../../types/ColorStatus";
import { getREM } from "../../constants/styles/utils";

interface CodeSentProps {
    error: any;
    loading: boolean;
    linkFetch: () => any;
    email: string;
}
const CodeSent = ({ error, loading, linkFetch, email }: CodeSentProps) => {
    const handleLinkFetch = () => {
        if (loading) {
            return;
        }
        linkFetch();
    };
    return (
        <Space
            direction="vertical"
            justify="center"
            align="center"
            size={`${getREM(theme.default.spaces[6] * 4)}`}
            fullWidth
        >
            {error && <Alert data-testid={error} message={NETWORK_ERROR} type="error" />}
            <Space direction="vertical" justify="center" align="stretch" fullWidth>
                <Title dataTestId="code_sent_title" level={3} weight="light" noMargin textAlign="center">
                    Check your mailbox
                </Title>
                <Title dataTestId="code_sent_mail" level={4} weight="light" textAlign="center">
                    {email}
                </Title>
            </Space>
            <Space size="small" justify="center">
                <Text size="extralarge" state={ColorStatus.disabled}>
                    Didn’t get the email?
                </Text>
                <StyledButtonLink data-testid="code_sent_resend_link" type="link" onClick={handleLinkFetch}>
                    Click here to resend it
                </StyledButtonLink>
            </Space>
        </Space>
    );
};
export default CodeSent;
