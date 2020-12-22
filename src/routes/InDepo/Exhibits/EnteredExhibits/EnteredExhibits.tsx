import React from "react";
import { Space, Row, Badge, Col } from "antd";
import Result from "../../../../components/Result";
import Icon from "../../../../components/Icon";
import { CustomStatus } from "../../../../components/Result/Result";
import Text from "../../../../components/Typography/Text";
import { ENTERED_EXHIBITS_SUBTITLE, ENTERED_EXHIBITS_TITLE } from "../../../../constants/exhibits";
import { ReactComponent as EnteredExhibitsIcon } from "../../../../assets/icons/EnteredExhibits-empty.svg";
import { ExhibitTabPaneSpacer } from "../styles";
import { theme } from "../../../../constants/styles/theme";

export default function EnteredExhibits() {
    return (
        <ExhibitTabPaneSpacer direction="vertical" size="large">
            <Space size="middle">
                <Text size="large" state="white">
                    Entered exhibits
                </Text>
                <Badge count={5} />
            </Space>
            <Row justify="center" align="middle" style={{ height: "100%" }}>
                <Col sm={18} lg={14} xl={13} xxl={9}>
                    <Result
                        icon={<Icon icon={EnteredExhibitsIcon} style={{ fontSize: "6.1rem" }} />}
                        title={ENTERED_EXHIBITS_TITLE}
                        subTitle={ENTERED_EXHIBITS_SUBTITLE}
                        status={CustomStatus.errorFetch}
                        titleColor={theme.default.primaryColor}
                        subTitleColor={theme.default.whiteColor}
                    />
                </Col>
            </Row>
        </ExhibitTabPaneSpacer>
    );
}
