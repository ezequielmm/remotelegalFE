import React from "react";
import { Col, Row, Space } from "antd";
import Button from "../../../components/Button";
import * as CONSTANTS from "../../../constants/createDeposition";
import CardFetchError from "../../../components/CardFetchError";
import { CustomStatus } from "../../../components/Result/Result";
import CardResult from "../../../components/CardResult";

interface SuccesCardProps {
    addNewCase: () => void;
    goToDepositions: () => void;
    refreshCasesList: () => void;
    type: "success" | "error";
}

export default function SuccesCard({ addNewCase, goToDepositions, refreshCasesList, type }: SuccesCardProps) {
    return type === "error" ? (
        <CardFetchError onClick={refreshCasesList} />
    ) : (
        <CardResult
            title={CONSTANTS.SUCCESS_DEPOSITION_TITLE}
            subTitle={CONSTANTS.SUCCESS_DEPOSITION_SUBTITLE}
            status={CustomStatus.successCreate}
            extra={
                <Row>
                    <Space direction="vertical" size="small" style={{ width: "100%" }}>
                        <Col sm={24}>
                            <Button type="primary" onClick={addNewCase} key="success_card_new_case_button">
                                {CONSTANTS.SCHEDULE_NEW_DEPOSITION}
                            </Button>
                        </Col>
                        <Col sm={24}>
                            <Button type="primary" onClick={goToDepositions} key="success_card_new_case_button">
                                {CONSTANTS.GO_TO_DEPOSITIONS}
                            </Button>
                        </Col>
                    </Space>
                </Row>
            }
        />
    );
}
