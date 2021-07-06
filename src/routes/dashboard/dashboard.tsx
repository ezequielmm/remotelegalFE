import React from "react";
import { useHistory } from "react-router-dom";
import { Col, Row } from "antd";
import Button from "prp-components-library/src/components/Button";
import Card from "prp-components-library/src/components/Card";
import Result from "prp-components-library/src/components/Result";
import { CustomStatus } from "prp-components-library/src/components/Result/Result";

const Dashboard = () => {
    const history = useHistory();
    return (
        <Row justify="center" align="middle" style={{ height: "100%" }}>
            <Col sm={24} lg={18} xl={13} xxl={10}>
                <Card data-testid="welcome_card">
                    <Result
                        title="Welcome to Remote Legal"
                        subTitle="Want to schedule a deposition? Click the button below"
                        status={CustomStatus.empty}
                        extra={
                            <Button
                                data-testid="dashboard_schedule_deposition_button"
                                type="primary"
                                onClick={() => history.push("/deposition/new")}
                            >
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
