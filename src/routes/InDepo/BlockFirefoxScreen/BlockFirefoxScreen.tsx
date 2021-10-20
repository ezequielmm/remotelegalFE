import { Row, Col, Image } from "antd";
import Button from "@rl/prp-components-library/src/components/Button";
import Space from "@rl/prp-components-library/src/components/Space";
import Text from "@rl/prp-components-library/src/components/Text";
import Title from "@rl/prp-components-library/src/components/Title";
import Icon from "@rl/prp-components-library/src/components/Icon";
import { ReactComponent as browserIcon } from "../../../assets/in-depo/Browser.svg";
import { ReactComponent as CopyIcon } from "../../../assets/icons/copy.svg";
import { StyledBlockFirefoxScreen, StyledButton, StyledCard, StyledCopyInvitationCard, StyledSpace } from "./styles";
import * as CONSTANTS from "../../../constants/blockFirefoxScreen";
import { COPY_LINK_SUCCESS_MSG, COPY_LINK_ALERT_DURATION, COPY_LINK_ERROR_MSG } from "../../../constants/inDepo";
import { theme } from "../../../constants/styles/theme";
import { getREM } from "../../../constants/styles/utils";
import ColorStatus from "../../../types/ColorStatus";
import useJoinDepositionLink from "../../../hooks/InDepo/useJoinDepositionLink";
import useFloatingAlertContext from "../../../hooks/useFloatingAlertContext";

const BlockFirefoxScreen = () => {
    const joinDepositionLink = useJoinDepositionLink();
    const addAlert = useFloatingAlertContext();
    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(joinDepositionLink);
            addAlert({
                message: COPY_LINK_SUCCESS_MSG,
                closable: true,
                type: "success",
                showIcon: false,
                duration: COPY_LINK_ALERT_DURATION,
                dataTestId: "copy_link_success_alert",
            });
        } catch (error) {
            addAlert({
                message: COPY_LINK_ERROR_MSG,
                type: "error",
                showIcon: false,
                duration: COPY_LINK_ALERT_DURATION,
                dataTestId: "copy_link_error_alert",
            });
        }
    };

    return (
        <StyledBlockFirefoxScreen>
            <Space justify="center" align="center" fullHeight fullWidth py={6}>
                <Col xs={22} sm={20} lg={16} xl={14} xxl={10}>
                    <StyledCard>
                        <Space direction="vertical" size="large" justify="center" align="center" fullWidth>
                            <Space.Item style={{ textAlign: "center" }}>
                                <Icon icon={browserIcon} size={`${getREM(theme.default.spaces[6] * 8)}`} />
                                <Title weight="light" level={4} ellipsis={false} textAlign="center">
                                    {CONSTANTS.BLOCK_FIREFOX_SCREEN_TITLE}
                                </Title>
                                <Text state={ColorStatus.disabled} ellipsis={false} align="center">
                                    {CONSTANTS.BLOCK_FIREFOX_SCREEN_SUBTITLE1}
                                </Text>
                                <Text state={ColorStatus.disabled} ellipsis={false} align="center">
                                    {CONSTANTS.BLOCK_FIREFOX_SCREEN_SUBTITLE2}
                                </Text>
                            </Space.Item>
                            <Space py={12} justify="center" fullWidth>
                                <Row
                                    gutter={[
                                        theme.default.spaces[12] * theme.default.baseUnit * 2,
                                        theme.default.spaces[12] * theme.default.baseUnit,
                                    ]}
                                >
                                    {CONSTANTS.BLOCK_FIREFOX_SCREEN_BROWSERS.map((browser) => (
                                        <Col xs={24} md={8}>
                                            <StyledSpace direction="vertical" align="center">
                                                <Image
                                                    src={browser.icon}
                                                    width={`${getREM(theme.default.spaces[6] * 4.5)}`}
                                                    preview={false}
                                                    alt={browser.name}
                                                />
                                                <Text ellipsis={false} align="center">
                                                    {browser.name}
                                                </Text>
                                                <Button type="link" href={browser.link} target="_blank">
                                                    {CONSTANTS.BLOCK_FIREFOX_SCREEN_BROWSER_BUTTON}
                                                </Button>
                                            </StyledSpace>
                                        </Col>
                                    ))}
                                </Row>
                            </Space>
                            <StyledCopyInvitationCard>
                                <Text state={ColorStatus.disabled} size="default" ellipsis={false}>
                                    {CONSTANTS.BLOCK_FIREFOX_SCREEN_COPY_INVITATION_DESCRIPTION}
                                </Text>
                                <StyledButton
                                    type="link"
                                    icon={
                                        <Icon
                                            icon={CopyIcon}
                                            style={{ fontSize: getREM(theme.default.fontSizes[5]) }}
                                        />
                                    }
                                    onClick={copyToClipboard}
                                    data-testid="copy_invitation_button"
                                >
                                    {CONSTANTS.BLOCK_FIREFOX_SCREEN_COPY_INVITATION_BUTTON}
                                </StyledButton>
                            </StyledCopyInvitationCard>
                        </Space>
                    </StyledCard>
                </Col>
            </Space>
        </StyledBlockFirefoxScreen>
    );
};

export default BlockFirefoxScreen;
