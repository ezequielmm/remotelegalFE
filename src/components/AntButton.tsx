import React from "react";
import { Button } from "antd";
import "antd/dist/antd.css";

export default function ({ onClick }: any) {
    return (
        <Button onClick={onClick} type="primary">
            Ant primary button
        </Button>
    );
}
