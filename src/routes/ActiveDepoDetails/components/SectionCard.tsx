import React from "react";
import Card from "../../../components/Card";
import Space from "../../../components/Space";
import Title from "../../../components/Typography/Title";

interface SectionCardProps {
    title: string;
    children: React.ReactNode;
}

const SectionCard = ({ children, title }: SectionCardProps) => (
    <Card hasShaddow={false} fullWidth>
        <Space mb={9}>
            <Title level={5} noMargin weight="regular" dataTestId={`deposition_details_${title}`}>
                {title}
            </Title>
        </Space>
        {children}
    </Card>
);
export default SectionCard;
