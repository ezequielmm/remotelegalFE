import React from "react";
import { Row, Col, Space } from "antd";
import { useFormContext } from "react-hook-form";
import RHFInput from "../../../components/RHFInput";
import Card from "../../../components/Card";
import Title from "../../../components/Typography/Title";
import * as CONSTANTS from "../../../constants/createDeposition";
import { theme } from "../../../constants/styles/theme";

interface RequesterSectionProps {
    invalidRequester?: string;
}

const RequesterSection = ({ invalidRequester }: RequesterSectionProps) => {
    const { control, errors } = useFormContext();
    return (
        <Card>
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
                <Col xs={24}>
                    <Title level={5} weight="regular" noMargin>
                        {CONSTANTS.REQUESTER_TITLE}
                    </Title>
                </Col>
                <Row gutter={theme.default.baseUnit * theme.default.spaces[5]} style={{ width: "100%" }}>
                    <Col xs={6}>
                        <RHFInput
                            control={control}
                            errorMessage={invalidRequester || errors?.requesterEmail?.message}
                            name="requesterEmail"
                            label={CONSTANTS.EMAIL_LABEL}
                            placeholder={CONSTANTS.EMAIL_PLACEHOLDER}
                            noMargin
                        />
                    </Col>
                    <Col xs={6}>
                        <RHFInput
                            control={control}
                            errorMessage={errors?.requesterName?.message}
                            name="requesterName"
                            label={CONSTANTS.NAME_LABEL}
                            placeholder={CONSTANTS.NAME_PLACEHOLDER}
                            noMargin
                        />
                    </Col>
                    <Col xs={6}>
                        <RHFInput
                            control={control}
                            errorMessage={errors?.requesterPhone?.message}
                            name="requesterPhone"
                            label={CONSTANTS.PHONE_LABEL}
                            placeholder={CONSTANTS.PHONE_PLACEHOLDER}
                            noMargin
                        />
                    </Col>
                </Row>
            </Space>
        </Card>
    );
};

export default RequesterSection;