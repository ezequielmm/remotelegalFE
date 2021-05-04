import React from "react";
import { Col, Row } from "antd";
import Card from "../../components/Card";
import Result from "../../components/Result";
import Text from "../../components/Typography/Text";
import Space from "../../components/Space";
import Icon from "../../components/Icon";
import { ReactComponent as HelpIcon } from "../../assets/layout/Help.svg";
import * as CONSTANTS from "../../constants/help";
import ColorStatus from "../../types/ColorStatus";

const Help = () => {
    return (
        <Row justify="center" align="middle" style={{ height: "100%" }}>
            <Col sm={24} lg={18} xl={12} xxl={10}>
                <Card>
                    <Space p={12}>
                        <Result
                            title={CONSTANTS.HELP_TITLE}
                            subTitle={
                                <Text state={ColorStatus.disabled} ellipsis={false}>
                                    <>
                                        {CONSTANTS.HELP_CONTENT1}
                                        <Text size="large" state={ColorStatus.disabled} weight="bold" ellipsis={false}>
                                            {CONSTANTS.HELP_CONTENT2}
                                        </Text>{" "}
                                        {CONSTANTS.HELP_CONTENT3}
                                        <Text size="large" state={ColorStatus.disabled} weight="bold" ellipsis={false}>
                                            {CONSTANTS.HELP_CONTENT4}
                                        </Text>
                                        .
                                    </>
                                </Text>
                            }
                            status="info"
                            icon={<Icon icon={HelpIcon} />}
                        />
                    </Space>
                </Card>
            </Col>
        </Row>
    );
};
export default Help;
