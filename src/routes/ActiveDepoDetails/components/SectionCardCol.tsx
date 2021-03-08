import React from "react";
import { Col } from "antd";
import { ColProps } from "antd/lib/col";
import Space from "../../../components/Space";
import Text from "../../../components/Typography/Text";
import ColorStatus from "../../../types/ColorStatus";
import Icon from "../../../components/Icon";

interface SectionCardColProps {
    icon: React.ComponentType;
    title: string;
    text?: string;
    children?: React.ReactNode;
    colProps?: ColProps;
}

const SectionCardCol = ({ icon, title, text, children, colProps }: SectionCardColProps) => (
    <Col {...colProps}>
        <Space>
            <Icon icon={icon} size={8} color={ColorStatus.disabled} />
            <Space direction="vertical" size="0">
                <Text dataTestId={`deposition_details_${title}`} size="small" uppercase state={ColorStatus.disabled}>
                    {title}
                </Text>
                {text ? (
                    <Text dataTestId={`deposition_details_${text}`} ellipsis={false}>
                        {text}
                    </Text>
                ) : (
                    children
                )}
            </Space>
        </Space>
    </Col>
);
export default SectionCardCol;
