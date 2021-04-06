import React from "react";
import styled from "styled-components";
import { getREM, hexToRGBA } from "../../constants/styles/utils";
import Space from "../Space";
import Icon from "../Icon";
import Text from "../Typography/Text";
import { theme } from "../../constants/styles/theme";
import ColorStatus from "../../types/ColorStatus";

export interface IStartMessageProps {
    title?: string;
    description?: string;
    icon?: React.ComponentType;
}

const StyledStartMessage = styled.div`
    position: fixed;
    bottom: ${getREM(theme.default.spaces[8] * 4)};
    right: ${getREM(theme.default.spaces[4])};
    background-color: ${hexToRGBA(theme.default.blackColor, 0.57)};
    padding: ${getREM(theme.default.spaces[9])};
    border-radius: ${getREM(theme.default.spaces[4])};
`;

const StartMessage = ({ title, description, icon, ...rest }: IStartMessageProps) => {
    return (
        <StyledStartMessage {...rest}>
            <Space>
                <Space.Item>
                    <Icon size={7} color={theme.default.primaryColor} icon={icon} />
                </Space.Item>
                <Space.Item>
                    <Text block state={ColorStatus.primary} weight="bold">
                        {title}
                    </Text>
                    <Text block size="small" state={ColorStatus.white}>
                        {description}
                    </Text>
                </Space.Item>
            </Space>
        </StyledStartMessage>
    );
};

export default StartMessage;
