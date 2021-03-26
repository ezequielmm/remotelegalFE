import React from "react";
import { Row, Spin } from "antd";

const Spinner = ({ height, width, className }: { height?: string; width?; className?: string }) => (
    <Row
        data-testid="spinner"
        justify="center"
        align="middle"
        style={{ height: height || "100vh", width: width || "auto" }}
        className={className}
    >
        <Spin size="large" />
    </Row>
);
export default Spinner;
