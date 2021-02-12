import React from "react";
import { useFormContext } from "react-hook-form";
import RHFTextArea from "../../../components/RHFTextArea";
import Space from "../../../components/Space";
import Card from "../../../components/Card";
import Title from "../../../components/Typography/Title";
import * as CONSTANTS from "../../../constants/createDeposition";

const DetailsSection = () => {
    const { control, errors } = useFormContext();
    return (
        <Card fullWidth>
            <Space direction="vertical" size="large" fullWidth>
                <Title level={5} weight="regular" noMargin dataTestId="details_title">
                    {CONSTANTS.DETAILS_TITLE}
                </Title>
                <RHFTextArea
                    control={control}
                    errorMessage={errors.details?.message}
                    name="details"
                    label={CONSTANTS.DETAILS_LABEL}
                    placeholder={CONSTANTS.DETAILS_PLACEHOLDER}
                    textAreaProps={{ rows: 4, maxLength: 500 }}
                    noMargin
                />
            </Space>
        </Card>
    );
};

export default DetailsSection;
