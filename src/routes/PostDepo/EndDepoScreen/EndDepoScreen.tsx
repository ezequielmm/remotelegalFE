import React from "react";
import { Row, Col } from "antd";
import Space from "../../../components/Space";
import Card from "../../../components/Card";
import Logo from "../../../components/Logo";
import Title from "../../../components/Typography/Title";
import Text from "../../../components/Typography/Text";
import { theme } from "../../../constants/styles/theme";
import { getREM } from "../../../constants/styles/utils";
import ColorStatus from "../../../types/ColorStatus";
import Button from "../../../components/Button";
import { useEndDepoCurrentUser, useEndDepoDownloadAssets } from "../../../hooks/endDepo/hooks";
import { StyledEndDepoScreenLayout } from "./styles";
import Spinner from "../../../components/Spinner";
import * as CONSTANTS from "../../../_tests_/constants/postDepo";
import { displayName } from "../../../helpers/displayName";

export default function EndDepoScreen({ location }) {
    const { userInfo, loadingUserInfo } = useEndDepoCurrentUser();
    const { downloadAssets } = useEndDepoDownloadAssets(location?.state?.depositionID);

    return (
        <StyledEndDepoScreenLayout>
            {loadingUserInfo && !userInfo ? (
                <Spinner />
            ) : (
                <Row justify="center" align="middle" style={{ height: "100%" }}>
                    <Col xs={22} sm={20} lg={16} xl={10} xxl={8}>
                        <Card
                            style={{
                                padding: `${getREM(theme.default.spaces[10] * 2)} 
                                ${getREM(theme.default.spaces[10] * 4)}`,
                            }}
                        >
                            <Row justify="center" align="middle">
                                <Space direction="vertical" size="small" justify="center" align="center" fullWidth>
                                    <Logo version="dark" height={getREM(theme.default.spaces[8] * 2)} />
                                    <Space.Item fullWidth style={{ textAlign: "center", marginTop: "10px" }}>
                                        <Title weight="bold" level={4} noMargin>
                                            {`${displayName(userInfo?.firstName, userInfo?.lastName)},`}
                                        </Title>
                                        <Title weight="light" level={4} ellipsis={false}>
                                            {CONSTANTS.END_DEPO_SCREEN_FIRST_TEXT}
                                        </Title>
                                        <Text state={ColorStatus.disabled} ellipsis={false}>
                                            {CONSTANTS.END_DEPO_SCREEN_SECOND_TEXT}
                                        </Text>
                                    </Space.Item>
                                    <Space.Item fullWidth style={{ textAlign: "center", marginTop: "15px" }}>
                                        <Button
                                            onClick={() => downloadAssets(userInfo)}
                                            type="primary"
                                            size="middle"
                                            data-testid="download_assets_button"
                                        >
                                            {CONSTANTS.END_DEPO_DOWNLOAD_BUTTON_LABEL}
                                        </Button>
                                    </Space.Item>
                                </Space>
                            </Row>
                        </Card>
                    </Col>
                </Row>
            )}
        </StyledEndDepoScreenLayout>
    );
}
