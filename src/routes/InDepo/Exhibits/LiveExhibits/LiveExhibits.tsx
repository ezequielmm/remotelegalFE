import React from "react";
import { Row } from "antd";
import Result from "../../../../components/Result";
import { CustomStatus } from "../../../../components/Result/Result";
import { LIVE_EXHIBITS_SUBTITLE, LIVE_EXHIBITS_TITLE } from "../../../../constants/exhibits";
import { ExhibitTabPaneSpacer } from "../styles";
import { theme } from "../../../../constants/styles/theme";

export default function LiveExhibits() {
    return (
        <ExhibitTabPaneSpacer direction="vertical" size="large">
            <Row justify="center" align="middle" style={{ height: "100%" }}>
                <Result
                    title={LIVE_EXHIBITS_TITLE}
                    subTitle={LIVE_EXHIBITS_SUBTITLE}
                    status={CustomStatus.successCreate}
                    titleColor={theme.default.primaryColor}
                    subTitleColor={theme.default.whiteColor}
                />
            </Row>
        </ExhibitTabPaneSpacer>
    );
}
