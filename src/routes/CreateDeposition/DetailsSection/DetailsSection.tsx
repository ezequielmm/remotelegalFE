import React from "react";
import { Col, Space } from "antd";
import { useFormContext } from "react-hook-form";
import RHFTextArea from "../../../components/RHFTextArea";
import Card from "../../../components/Card";
import Title from "../../../components/Typography/Title";
import * as CONSTANTS from "../../../constants/createDeposition";

const DetailsSection = () => {
    const { control, errors } = useFormContext();
    return (
        <Card>
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
                <Col xs={24}>
                    <Title level={5} weight="regular" noMargin>
                        {CONSTANTS.DETAILS_TITLE}
                    </Title>
                </Col>
                <Col xs={24}>
                    <RHFTextArea
                        control={control}
                        errorMessage={errors.details?.message}
                        name="details"
                        label={CONSTANTS.DETAILS_LABEL}
                        placeholder={CONSTANTS.DETAILS_PLACEHOLDER}
                        textAreaProps={{ rows: 4, maxLength: 500 }}
                        noMargin
                    />
                </Col>
            </Space>
        </Card>
    );
};

export default DetailsSection;
