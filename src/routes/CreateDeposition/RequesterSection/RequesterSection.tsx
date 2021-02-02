import React from "react";
import { Row, Col } from "antd";
import { useFormContext } from "react-hook-form";
import Space from "../../../components/Space";
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
        <Card fullWidth>
            <Space direction="vertical" size="large" fullWidth>
                <Title level={5} weight="regular" noMargin>
                    {CONSTANTS.REQUESTER_TITLE}
                </Title>
                <Row gutter={theme.default.baseUnit * theme.default.spaces[9]} style={{ width: "100%" }}>
                    <Col xs={8}>
                        <RHFInput
                            control={control}
                            errorMessage={invalidRequester || errors?.requesterEmail?.message}
                            name="requesterEmail"
                            label={CONSTANTS.EMAIL_LABEL}
                            placeholder={CONSTANTS.EMAIL_PLACEHOLDER}
                            noMargin
                        />
                    </Col>
                    <Col xs={8}>
                        <RHFInput
                            control={control}
                            errorMessage={errors?.requesterName?.message}
                            name="requesterName"
                            label={CONSTANTS.NAME_LABEL}
                            placeholder={CONSTANTS.NAME_PLACEHOLDER}
                            noMargin
                        />
                    </Col>
                    <Col xs={8}>
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
