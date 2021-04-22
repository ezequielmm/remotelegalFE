import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import { Row, Col } from "antd";
import RHFSelect from "../../../components/RHFSelect/RHFSelect";
import Select from "../../../components/Select";
import Text from "../../../components/Typography/Text";
import Title from "../../../components/Typography/Title";
import Button from "../../../components/Button";
import Card from "../../../components/Card";
import Space from "../../../components/Space";
import * as CONSTANTS from "../../../constants/createDeposition";
import ColorStatus from "../../../types/ColorStatus";
import CaseModal from "../../MyCases/CaseModal";

interface CaseSectionProps {
    selectedCaseId: string;
    setSelectedCaseId: Dispatch<SetStateAction<string>>;
    cases: Record<string, any>;
    loadingCases: boolean;
    fetchingError: boolean;
    fetchCases: () => void;
    invalidCase: boolean;
    setInvalidCase: Dispatch<SetStateAction<boolean>>;
}

const CaseSection = ({
    cases,
    loadingCases,
    fetchingError,
    fetchCases,
    setSelectedCaseId,
    invalidCase,
    setInvalidCase,
    selectedCaseId,
}: CaseSectionProps) => {
    const [openCaseModal, setOpenCaseModal] = useState(false);

    const handleCloseModal = useCallback(() => {
        setOpenCaseModal(false);
    }, []);

    useEffect(() => {
        if (selectedCaseId.length) {
            setInvalidCase(false);
        }
    }, [selectedCaseId, setInvalidCase]);

    return (
        <Card fullWidth>
            <CaseModal
                setCase={setSelectedCaseId}
                noStep2
                open={openCaseModal}
                fetchCases={fetchCases}
                handleClose={handleCloseModal}
            />

            <Space direction="vertical" size="large" fullWidth>
                <Space.Item fullWidth>
                    <Title level={5} weight="regular" dataTestId="cases_title">
                        {CONSTANTS.CASE_TITLE}
                    </Title>
                    <Text dataTestId="cases_subtitle" state={ColorStatus.disabled} ellipsis={false}>
                        {CONSTANTS.CASE_SUBTITLE}
                    </Text>
                </Space.Item>
                <Row style={{ width: "100%" }}>
                    <Col xs={10}>
                        <RHFSelect
                            controlledOnBlur={() => {
                                if (!selectedCaseId) {
                                    setInvalidCase(true);
                                }
                            }}
                            controlledValue={loadingCases ? "Loading..." : selectedCaseId}
                            controlledOnChange={(val) => {
                                setSelectedCaseId(val);
                            }}
                            dataTestId="case_selector"
                            placeholder={CONSTANTS.CASE_SELECT_PLACEHOLDER}
                            label="Case"
                            name="caseId"
                            customInvalid={invalidCase && !openCaseModal && !loadingCases}
                            control={null}
                            loading={loadingCases}
                            disabled={fetchingError || loadingCases}
                            noMargin
                            items={cases}
                            errorMessage={
                                invalidCase && !openCaseModal && !loadingCases ? CONSTANTS.INVALID_CASE_MESSAGE : null
                            }
                            afteScrollRender={
                                <Space p={6} pb={2}>
                                    <Button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setOpenCaseModal(true);
                                        }}
                                        data-testid="new_case_button"
                                        block
                                        type="primary"
                                        size="middle"
                                    >
                                        ADD NEW CASE
                                    </Button>
                                </Space>
                            }
                            renderItem={(item) => (
                                <Select.Option data-testid={item.name} key={item.id} value={item.id}>
                                    {item.name}
                                    {item.caseNumber && ` | ${item.caseNumber}`}
                                </Select.Option>
                            )}
                            filter={(input, option) =>
                                option.children.length
                                    ? option.children[0].toLowerCase().includes(input.toLowerCase())
                                    : true
                            }
                        />
                    </Col>
                </Row>
            </Space>
        </Card>
    );
};

export default CaseSection;
