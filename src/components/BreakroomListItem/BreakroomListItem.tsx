import React from "react";
import { Row } from "antd";
import Text from "../Typography/Text";
import Button from "../Button";
import ColorStatus from "../../types/ColorStatus";

export default function BreakroomListItem({
    id,
    name,
    joinBreakroom,
}: {
    id: string;
    name: string;
    joinBreakroom: (roomNumber: string) => void;
}) {
    return (
        <Row align="middle" justify="space-between" style={{ width: "100%" }}>
            <div>
                <Text block state={ColorStatus.primary}>
                    {name}
                </Text>
            </div>
            <Button onClick={() => joinBreakroom(id)} type="link">
                JOIN
            </Button>
        </Row>
    );
}
