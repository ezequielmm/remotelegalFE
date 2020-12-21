import React from "react";
import { Space, Row, Badge } from "antd";
import Result from "../../../../components/Result";
import { CustomStatus } from "../../../../components/Result/Result";
import Text from "../../../../components/Typography/Text";
import { MY_EXHIBITS_RESULT_SUBTITLE, MY_EXHIBITS_RESULT_TITLE } from "../../../../constants/exhibits";
import { ExhibitTabPaneSpacer } from "../styles";
import { theme } from "../../../../constants/styles/theme";
import { useParams } from "react-router-dom";
import { useUploadFile } from "../../../../hooks/exhibits/hooks";
import UploadButton from "./UploadButton";

export default function MyExhibits() {
    const { depositionID } = useParams<{ depositionID: string }>();
    const { upload } = useUploadFile(depositionID);
    return (
        <ExhibitTabPaneSpacer direction="vertical" size="large">
            <Space size="middle">
                <Text size="large" state="white">
                    My Exhibits
                </Text>
                <Badge count={5} />
            </Space>
            <UploadButton onUpload={upload} />
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
