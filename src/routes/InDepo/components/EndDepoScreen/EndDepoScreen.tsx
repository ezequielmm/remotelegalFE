import React from "react";
import { Row, Col, Layout, Space } from "antd";
import Card from "../../../../components/Card";
import Logo from "../../../../components/Logo";
import Title from "../../../../components/Typography/Title";
import Text from "../../../../components/Typography/Text";
import { theme } from "../../../../constants/styles/theme";
import { getREM } from "../../../../constants/styles/utils";

const EndDepoScreen = () => (
    <Layout style={{ height: "100vh" }}>
        <Row justify="center" align="middle" style={{ height: "100%" }}>
            <Col xs={22} sm={20} lg={16} xl={10} xxl={8}>
                <Card style={{ padding: getREM(theme.default.spaces[6] * 4) }}>
                    <Row justify="center" align="middle">
                        <Space direction="vertical" size="large" style={{ textAlign: "center" }}>
                            <Logo version="dark" height={getREM(theme.default.spaces[8])} />
                            <div>
                                <Title level={4} weight="light">
                                    This deposition has ended
                                </Title>
                                <Text state="disabled">Thanks for using Remote Legal.</Text>
                            </div>
                        </Space>
                    </Row>
                </Card>
            </Col>
        </Row>
    </Layout>
);

export default EndDepoScreen;
