import React from "react";
import { useHistory } from "react-router-dom";
import { Col, Row } from "antd";
import Card from "../../components/Card";
import Result from "../../components/Result";
import Button from "../../components/Button";

const Dashboard = () => {
    const history = useHistory();
    return (
        <Row justify="center" align="middle" style={{ height: "100%" }}>
            <Col sm={24} lg={18} xl={13} xxl={10}>
                <Card>
                    <Result
                        title="Welcome to Remote Legal"
                        subTitle="Want to schedule a deposition? Click the button below"
                        status="empty"
                        extra={
                            <Button type="primary" onClick={() => history.push("/deposition")}>
                                Schedule deposition
                            </Button>
                        }
                    />
                </Card>
            </Col>
        </Row>
    );
};
export default Dashboard;
