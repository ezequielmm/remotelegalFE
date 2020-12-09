import { Col, Row } from "antd";
import { ResultStatusType } from "antd/lib/result";
import React from "react";
import Card from "../Card";
import Result from "../Result";
import { CustomStatus } from "../Result/Result";

export default function CardResult({
    title,
    subTitle,
    status,
    extra,
}: {
    title: string;
    subTitle: string;
    status?: ResultStatusType | CustomStatus;
    extra: React.ReactNode;
}) {
    return (
        <Row justify="center" align="middle" style={{ height: "100%" }}>
            <Col sm={24} lg={18} xl={13} xxl={10}>
                <Card>
                    <Result title={title} subTitle={subTitle} status={status} extra={extra} />
                </Card>
            </Col>
        </Row>
    );
}
