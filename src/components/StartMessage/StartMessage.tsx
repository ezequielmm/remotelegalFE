import React, { useState } from "react";
import styled from "styled-components";
import Icon from "prp-components-library/src/components/Icon";
import Space from "prp-components-library/src/components/Space";
import Text from "prp-components-library/src/components/Text";
import { getREM, hexToRGBA } from "../../constants/styles/utils";
import { theme } from "../../constants/styles/theme";
import ColorStatus from "../../types/ColorStatus";
import { ReactComponent as CalendarIcon } from "../../assets/icons/close.svg";
import useWindowSize from "../../hooks/useWindowSize";

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
    border-radius: ${getREM(theme.default.spaces[4])};
    width: calc(100% - ${getREM(theme.default.spaces[8])});
    max-width: ${getREM(35)};
    @media (min-width: ${theme.default.breakpoints.sm}) {
        padding-right: ${getREM(theme.default.spaces[10] + theme.default.spaces[12])};
    }
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

const StyledTitleSpace = styled(Space)`
    padding-right: ${getREM(theme.default.spaces[6])};
`;

const StartMessage = ({ title, description, icon, open = true, ...rest }: IStartMessageProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(open);
    const [windowWidth] = useWindowSize();

    const closeMessage = () => {
        setIsOpen(false);
    };

    return (
        <>
            {isOpen && (
                <StyledStartMessage {...rest}>
                    <StyledCloseIcon
                        data-testid="message_close_button"
                        onClick={closeMessage}
                        icon={CalendarIcon}
                        size={9}
                    />
                    {windowWidth < parseInt(theme.default.breakpoints.sm, 10) ? (
                        <>
                            <StyledTitleSpace>
                                <Space.Item>
                                    <Icon size={9} color={theme.default.primaryColor} icon={icon} />
                                </Space.Item>
                                <Space.Item>
                                    <Space direction="vertical" size={2}>
                                        <Text
                                            block
                                            ellipsis={false}
                                            size="small"
                                            state={ColorStatus.primary}
                                            weight="bold"
                                        >
                                            {title}
                                        </Text>
                                    </Space>
                                </Space.Item>
                            </StyledTitleSpace>
                            <Text block size="small" ellipsis={false} state={ColorStatus.white}>
                                {description}
                            </Text>
                        </>
                    ) : (
                        <Space>
                            <Space.Item>
                                <Icon size={9} color={theme.default.primaryColor} icon={icon} />
                            </Space.Item>
                            <Space.Item>
                                <Space direction="vertical" size={2}>
                                    <Text block ellipsis={false} state={ColorStatus.primary} size="large" weight="bold">
                                        {title}
                                    </Text>
                                    <Text block ellipsis={false} state={ColorStatus.white}>
                                        {description}
                                    </Text>
                                </Space>
                            </Space.Item>
                        </Space>
                    )}
                </StyledStartMessage>
            )}
        </>
    );
};

export default StartMessage;
