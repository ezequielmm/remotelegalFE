import React from "react";
import { Row, Spin } from "antd";

const Spinner = ({ height, width }: { height?: string; width? }) => (
    <Row
        data-testid="spinner"
        justify="center"
        align="middle"
        style={{ height: height || "100vh", width: width || "auto" }}
    >
        <Spin size="large" />
    </Row>
);
export default Spinner;
