import React from "react";
import { Row, Col, Layout } from "antd";
import Space from "../../../../components/Space";
import Card from "../../../../components/Card";
import Logo from "../../../../components/Logo";
import Title from "../../../../components/Typography/Title";
import Text from "../../../../components/Typography/Text";
import { theme } from "../../../../constants/styles/theme";
import { getREM } from "../../../../constants/styles/utils";
import ColorStatus from "../../../../types/ColorStatus";

const EndDepoScreen = () => (
    <Layout style={{ height: "100vh" }}>
        <Row justify="center" align="middle" style={{ height: "100%" }}>
            <Col xs={22} sm={20} lg={16} xl={10} xxl={8}>
                <Card style={{ padding: getREM(theme.default.spaces[10] * 4) }}>
                    <Row justify="center" align="middle">
                        <Space direction="vertical" size="large" justify="center" align="center" fullWidth>
                            <Logo version="dark" height={getREM(theme.default.spaces[8] * 2)} />
                            <Space.Item fullWidth style={{ textAlign: "center" }}>
                                <Title level={4} weight="light">
                                    This deposition has ended
                                </Title>
                                <Text state={ColorStatus.disabled}>Thanks for using Remote Legal.</Text>
                            </Space.Item>
                        </Space>
                    </Row>
                </Card>
            </Col>
        </Row>
    </Layout>
);

export default EndDepoScreen;
