import React from "react";
import { Row } from "antd";
import Card from "../../../components/Card";
import Space from "../../../components/Space";
import Title from "../../../components/Typography/Title";
import Button from "../../../components/Button";
import Icon from "../../../components/Icon";
import * as CONSTANTS from "../../../constants/activeDepositionDetails";
import { ReactComponent as EditIcon } from "../../../assets/icons/edit.svg";

interface SectionCardProps {
    title: string;
    children: React.ReactNode;
    actionTrigger?: () => void;
}

const SectionCard = ({ children, title, actionTrigger }: SectionCardProps) => (
    <Card
        hasShaddow={false}
        fullWidth
        extra={
            <Button
                data-testid={CONSTANTS.DEPOSITION_CARD_DETAILS_EDIT_BUTTON_DATA_TEST_ID}
                type="link"
                onClick={actionTrigger}
                icon={<Icon icon={EditIcon} size={8} />}
            >
                {CONSTANTS.DEPOSITION_CARD_DETAILS_ACTION_TRIGGER.toUpperCase()}
            </Button>
        }
    >
        <Space mb={9}>
            <Row align="middle" justify="space-between" style={{ width: "100%" }}>
                <Title level={5} noMargin weight="regular" dataTestId={`deposition_details_${title}`}>
                    {title}
                </Title>
            </Row>
        </Space>
        {children}
    </Card>
);
export default SectionCard;
