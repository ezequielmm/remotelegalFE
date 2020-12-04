import React from "react";
import { Row, Spin } from "antd";

const Spinner = () => (
    <Row data-testid="spinner" justify="center" align="middle" style={{ height: "100vh" }}>
        <Spin size="large" />
    </Row>
);
export default Spinner;
