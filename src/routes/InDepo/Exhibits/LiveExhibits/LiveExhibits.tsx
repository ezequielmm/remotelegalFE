import React from "react";
import { Row, Col } from "antd";
import Result from "../../../../components/Result";
import Icon from "../../../../components/Icon";
import { CustomStatus } from "../../../../components/Result/Result";
import { LIVE_EXHIBITS_SUBTITLE, LIVE_EXHIBITS_TITLE } from "../../../../constants/exhibits";
import { ReactComponent as LiveExhibitsIcon } from "../../../../assets/icons/LiveExhibits-empty.svg";
import { ExhibitTabPaneSpacer } from "../styles";
import { theme } from "../../../../constants/styles/theme";

export default function LiveExhibits() {
    return (
        <ExhibitTabPaneSpacer direction="vertical" size="large">
            <Row justify="center" align="middle" style={{ height: "100%" }}>
                <Col sm={18} lg={14} xl={13} xxl={9}>
                    <Result
                        icon={<Icon icon={LiveExhibitsIcon} style={{ fontSize: "6.1rem" }} />}
                        title={LIVE_EXHIBITS_TITLE}
                        subTitle={LIVE_EXHIBITS_SUBTITLE}
                        status={CustomStatus.successCreate}
                        titleColor={theme.default.primaryColor}
                        subTitleColor={theme.default.whiteColor}
                    />
                </Col>
            </Row>
        </ExhibitTabPaneSpacer>
    );
}
