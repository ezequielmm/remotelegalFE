import React from "react";
import { Card, Col, Row } from "antd";
import Result from "../../components/Result";
import Button from "../../components/Button";

const MyCases = () => {
    return (
        <Row justify="center" align="middle" style={{ height: "100%" }}>
            <Col sm={24} lg={18} xl={12} xxl={10}>
                <Card>
                    <Result
                        title="No cases added yet"
                        subTitle="Currently, you don’t have any case added yet. Do you want to add a case?"
                        status="empty"
                        extra={<Button type="primary">ADD CASE</Button>}
                    />
                </Card>
            </Col>
        </Row>
    );
};
export default MyCases;
