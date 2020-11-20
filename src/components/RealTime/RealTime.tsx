import React from "react";
import styled from "styled-components";
import { getREM } from "../../constants/styles/utils";
import { theme } from "../../constants/styles/theme";
import { ReactComponent as CloseIcon } from "../../assets/icons/close.svg";
import Icon from "../Icon";

interface RealTimeProps {
    visible: boolean;
    onClick: () => void;
}

interface StyledContainerProps extends Pick<RealTimeProps, "visible"> {}

export const StyledContainer = styled.div<StyledContainerProps>`
    display: flex;
    flex-direction: column;
    height: 100%;
    flex: 1 1 0%;
    padding: ${({ theme }) => getREM(theme.default.spaces[3])};
    margin-right: ${({ theme }) => getREM(theme.default.spaces[3])};
    border-radius: ${({ theme }) => getREM(theme.default.borderRadiusBase)};
    overflow: hidden;
    background: ${({ theme }) => theme.colors.inDepoNeutrals[6]};
    ${({ visible }) => {
        return `
            visibility: ${visible ? "visible" : "hidden"};
            position: ${visible ? "static" : "absolute"};
            left: ${visible ? "0" : "-9999px"};
        `;
    }}
`;

const StyledHeader = styled.div`
    display: flex;
    justify-content: space-between;
    flex-direction: row-reverse;
    width: 100%;
    padding-bottom: ${({ theme }) => getREM(theme.default.spaces[3])};
`;

const StyledContent = styled.div`
    flex: 1 0 0%;
`;

const RealTime = ({ visible, onClick }: RealTimeProps) => {
    return (
        <StyledContainer visible={visible}>
            <StyledHeader>
                <Icon icon={CloseIcon} onClick={onClick} style={{ color: theme.default.whiteColor }} />
            </StyledHeader>
            <StyledContent />
        </StyledContainer>
    );
};

export default RealTime;
