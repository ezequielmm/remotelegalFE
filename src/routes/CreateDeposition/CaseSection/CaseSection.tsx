import React from "react";
import { Col, Space } from "antd";
import { useFormContext } from "react-hook-form";
import RHFSelect from "../../../components/RHFSelect/RHFSelect";
import Select from "../../../components/Select";
import Text from "../../../components/Typography/Text";
import Title from "../../../components/Typography/Title";
import Button from "../../../components/Button";
import Card from "../../../components/Card";
import * as CONSTANTS from "../../../constants/createDeposition";
import ColorStatus from "../../../types/ColorStatus";

interface CaseSectionProps {
    cases: Record<string, any>;
    loadingCases: boolean;
    fetchingError: boolean;
}

const CaseSection = ({ cases, loadingCases, fetchingError }: CaseSectionProps) => {
    const { control, errors } = useFormContext();

    return (
        <Card>
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
                <Col xs={24}>
                    <Title level={5} weight="regular">
                        {CONSTANTS.CASE_TITLE}
                    </Title>
                    <Text state={ColorStatus.disabled} ellipsis={false}>
                        {CONSTANTS.CASE_SUBTITLE}
                    </Text>
                </Col>
                <Col xs={10}>
                    <RHFSelect
                        dataTestId="case_selector"
                        placeholder={CONSTANTS.CASE_SELECT_PLACEHOLDER}
                        label="Case"
                        name="caseId"
                        control={control}
                        errorMessage={errors.caseId?.message}
                        loading={loadingCases}
                        disabled={fetchingError}
                        noMargin
                        items={cases}
                        renderItem={(item) => (
                            <Select.Option data-testid={item.name} key={item.id} value={item.id}>
                                {item.name}
                            </Select.Option>
                        )}
                        renderUnselectableOption={() => (
                            <Button data-testid="new_case_button" disabled style={{ width: "100%" }}>
                                ADD NEW CASE
                            </Button>
                        )}
                    />
                </Col>
            </Space>
        </Card>
    );
};

export default CaseSection;
