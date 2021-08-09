import React, { useState } from "react";
import styled from "styled-components";
import Icon from "prp-components-library/src/components/Icon";
import Text from "prp-components-library/src/components/Text";
import { getREM, hexToRGBA } from "../../constants/styles/utils";
import { theme } from "../../constants/styles/theme";
import ColorStatus from "../../types/ColorStatus";
import { ReactComponent as CalendarIcon } from "../../assets/icons/close.svg";

export interface IFloatingMessageProps {
    message?: string;
    open?: boolean;
}

const StyledFloatingMessage = styled.div`
    ${({ theme }) => `
        position: absolute;
        bottom: 100%;
        left: ${getREM(theme.default.spaces[6])};
        right: ${getREM(theme.default.spaces[6])};
        background-color: ${hexToRGBA("#000000", 0.8)};
        border-radius: ${getREM(theme.default.spaces[4])};
        padding: ${getREM(theme.default.spaces[8])} ${getREM(theme.default.spaces[12] * 2)} ${getREM(
        theme.default.spaces[8]
    )} ${getREM(theme.default.spaces[4])};
        margin-right: 0 !important;
        margin-bottom: ${getREM(theme.default.spaces[3])};
    `}
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

const FloatingMessage = ({ message, open = true, ...rest }: IFloatingMessageProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(open);

    const closeMessage = () => {
        setIsOpen(false);
    };

    return (
        <>
            {isOpen && (
                <StyledFloatingMessage {...rest}>
                    <StyledCloseIcon onClick={closeMessage} icon={CalendarIcon} size={9} />
                    <Text block ellipsis={false} size="small" state={ColorStatus.white}>
                        {message}
                    </Text>
                </StyledFloatingMessage>
            )}
        </>
    );
};

export default FloatingMessage;
