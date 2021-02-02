import React from "react";
import { Col, Row } from "antd";
import Space from "../../../components/Space";
import Button from "../../../components/Button";
import * as CONSTANTS from "../../../constants/createDeposition";
import CardFetchError from "../../../components/CardFetchError";
import { CustomStatus } from "../../../components/Result/Result";
import CardResult from "../../../components/CardResult";
import { ReactComponent as SuccessCreateIcon } from "../../../assets/icons/success-schedule.svg";
import Icon from "../../../components/Icon";

interface CreateDepositionResultCardProps {
    addNewCase: () => void;
    createdDepositions: number;
    goToDepositions: () => void;
    refreshCasesList: () => void;
    type: "success" | "error";
}

export default function CreateDepositionResultCard({
    addNewCase,
    createdDepositions,
    goToDepositions,
    refreshCasesList,
    type,
}: CreateDepositionResultCardProps) {
    return type === "error" ? (
        <CardFetchError onClick={refreshCasesList} />
    ) : (
        <CardResult
            title={CONSTANTS.getSuccessDepositionTitle(createdDepositions)}
            subTitle={CONSTANTS.SUCCESS_DEPOSITION_SUBTITLE}
            status={CustomStatus.successCreate}
            icon={<Icon icon={SuccessCreateIcon} />}
            extra={
                <Row>
                    <Space direction="vertical" size="small" justify="center" align="center" fullWidth>
                        <Col sm={24}>
                            <Button
                                data-testid="schedule_new_deposition_button"
                                type="primary"
                                onClick={addNewCase}
                                key="success_card_new_case_button"
                            >
                                {CONSTANTS.SCHEDULE_NEW_DEPOSITION}
                            </Button>
                        </Col>
                        <Col sm={24}>
                            <Button
                                data-testid="go_to_deposition_button"
                                type="text"
                                onClick={goToDepositions}
                                key="success_card_new_case_button"
                            >
                                {CONSTANTS.GO_TO_DEPOSITIONS}
                            </Button>
                        </Col>
                    </Space>
                </Row>
            }
        />
    );
}
