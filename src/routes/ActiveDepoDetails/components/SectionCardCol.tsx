import React from "react";
import { Col } from "antd";
import { ColProps } from "antd/lib/col";
import Icon from "prp-components-library/src/components/Icon";
import Space from "prp-components-library/src/components/Space";
import Text from "prp-components-library/src/components/Text";
import ColorStatus from "../../../types/ColorStatus";

interface SectionCardColProps {
    icon: React.ComponentType;
    title: string;
    text?: string;
    children?: React.ReactNode;
    testId?: string;
    colProps?: ColProps;
}

const SectionCardCol = ({ icon, title, text, children, colProps, testId }: SectionCardColProps) => (
    <Col {...colProps}>
        <Space>
            <Icon icon={icon} size={8} color={ColorStatus.disabled} />
            <Space direction="vertical" size="0">
                <Text dataTestId={`deposition_details_${title}`} size="small" uppercase state={ColorStatus.disabled}>
                    {title}
                </Text>
                {text ? (
                    <Text dataTestId={testId || `deposition_details_${text}`} ellipsis={false}>
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
