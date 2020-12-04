import React from "react";
import { Col, Row, Space } from "antd";
import Card from "../../../components/Card";
import Result from "../../../components/Result";
import Button from "../../../components/Button";
import * as CONSTANTS from "../../../constants/createDeposition";
import * as CASE_CONSTANTS from "../../../constants/cases";

interface SuccesCardProps {
    addNewCase: () => void;
    goToDepositions: () => void;
    refreshCasesList: () => void;
    type: "success" | "error";
}

export default function SuccesCard({ addNewCase, goToDepositions, refreshCasesList, type }: SuccesCardProps) {
    return (
        <Row justify="center" align="middle" style={{ height: "100%" }}>
            <Col sm={24} lg={18} xl={13} xxl={10}>
                <Card>
                    {type === "error" ? (
                        <Result
                            title={CASE_CONSTANTS.FETCH_ERROR_MODAL_TITLE}
                            subTitle={CASE_CONSTANTS.FETCH_ERROR_MODAL_BODY}
                            status="error-fetch"
                            extra={[
                                <Button type="primary" onClick={refreshCasesList} key="console">
                                    {CASE_CONSTANTS.FETCH_ERROR_MODAL_BUTTON}
                                </Button>,
                            ]}
                        />
                    ) : (
                        <Result
                            title={CONSTANTS.SUCCESS_DEPOSITION_TITLE}
                            subTitle={CONSTANTS.SUCCESS_DEPOSITION_SUBTITLE}
                            status="success-create"
                            extra={
                                <Row>
                                    <Space direction="vertical" size="small" style={{ width: "100%" }}>
                                        <Col sm={24}>
                                            <Button
                                                type="primary"
                                                onClick={addNewCase}
                                                key="success_card_new_case_button"
                                            >
                                                {CONSTANTS.SCHEDULE_NEW_DEPOSITION}
                                            </Button>
                                        </Col>
                                        <Col sm={24}>
                                            <Button
                                                type="primary"
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
                    )}
                </Card>
            </Col>
        </Row>
    );
}
