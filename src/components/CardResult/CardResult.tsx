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
    icon,
    width,
}: {
    title: string;
    subTitle: string;
    status?: ResultStatusType | CustomStatus;
    width?: string;
    icon?: React.ReactNode;
    extra: React.ReactNode;
}) {
    return (
        <Row justify="center" align="middle" style={{ height: "100%", width: width || "auto" }}>
            <Col sm={24} lg={18} xl={13} xxl={10}>
                <Card data-testid={`${title}`}>
                    <Result title={title} subTitle={subTitle} status={status} extra={extra} icon={icon} />
                </Card>
            </Col>
        </Row>
    );
}
