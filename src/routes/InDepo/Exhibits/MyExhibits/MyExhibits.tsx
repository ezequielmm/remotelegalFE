import React from "react";
import { Space, Row, Badge } from "antd";
import Result from "../../../../components/Result";
import { CustomStatus } from "../../../../components/Result/Result";
import Text from "../../../../components/Typography/Text";
import { MY_EXHIBITS_RESULT_SUBTITLE, MY_EXHIBITS_RESULT_TITLE } from "../../../../constants/exhibits";
import { ExhibitTabPaneSpacer, UploadFilesContainer } from "../styles";
import { theme } from "../../../../constants/styles/theme";

export default function MyExhibits() {
    return (
        <ExhibitTabPaneSpacer direction="vertical" size="large">
            <Space size="middle">
                <Text size="large" state="white">
                    My Exhibits
                </Text>
                <Badge count={5} />
            </Space>
            <UploadFilesContainer>UPLOAD FILES</UploadFilesContainer>
            <Row justify="center" align="middle" style={{ height: "100%" }}>
                <Result
                    title={MY_EXHIBITS_RESULT_TITLE}
                    subTitle={MY_EXHIBITS_RESULT_SUBTITLE}
                    status={CustomStatus.empty}
                    titleColor={theme.default.primaryColor}
                    subTitleColor={theme.default.whiteColor}
                />
            </Row>
        </ExhibitTabPaneSpacer>
    );
}
