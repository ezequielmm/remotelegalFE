import React, { useState } from "react";
import styled from "styled-components";
import { getREM, hexToRGBA } from "../../constants/styles/utils";
import Space from "../Space";
import Icon from "../Icon";
import Text from "../Typography/Text";
import { theme } from "../../constants/styles/theme";
import ColorStatus from "../../types/ColorStatus";
import { ReactComponent as CalendarIcon } from "../../assets/icons/close.svg";

export interface IStartMessageProps {
    title?: string;
    description?: string;
    icon?: React.ComponentType;
    open?: boolean;
}

const StyledStartMessage = styled.div`
    position: fixed;
    bottom: ${getREM(theme.default.spaces[8] * 4)};
    right: ${getREM(theme.default.spaces[4])};
    background-color: ${hexToRGBA("#000000", 0.57)};
    padding: ${getREM(theme.default.spaces[9])};
    padding-right: ${getREM(theme.default.spaces[10] + theme.default.spaces[12])};
    border-radius: ${getREM(theme.default.spaces[4])};
    max-width: ${getREM(35)};
`;

const StyledCloseIcon = styled(Icon)`
    position: absolute;
    top: ${getREM(theme.default.spaces[6])};
    right: ${getREM(theme.default.spaces[6])};
    color: #fff;
    cursor: pointer;
    transition: all 0.3s;
    &:hover {
        opacity: 0.5;
    }
`;

const StartMessage = ({ title, description, icon, open = true, ...rest }: IStartMessageProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(open);

    const closeMessage = () => {
        setIsOpen(false);
    };

    return (
        <>
            {isOpen && (
                <StyledStartMessage {...rest}>
                    <StyledCloseIcon onClick={closeMessage} icon={CalendarIcon} size={9} />
                    <Space>
                        <Space.Item>
                            <Icon size={9} color={theme.default.primaryColor} icon={icon} />
                        </Space.Item>
                        <Space.Item>
                            <Space direction="vertical" size={2}>
                                <Text block size="large" state={ColorStatus.primary} weight="bold">
                                    {title}
                                </Text>
                                <Text block ellipsis={false} state={ColorStatus.white}>
                                    {description}
                                </Text>
                            </Space>
                        </Space.Item>
                    </Space>
                </StyledStartMessage>
            )}
        </>
    );
};

export default StartMessage;
