import styled from "styled-components";
import { getREM } from "../../constants/styles/utils";

export const StyledInDepoContainer = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
`;

export const StyledInDepoLayout = styled.div`
    height: calc(100% - ${({ theme }) => getREM(theme.default.spaces[9] * 3)});
    position: relative;
    display: flex;
    justify-content: center;
    background: linear-gradient(
        to bottom,
        ${({ theme }) => theme.colors.inDepoNeutrals[2]} 0%,
        ${({ theme }) => theme.colors.inDepoNeutrals[2]} 60%,
        ${({ theme }) => theme.colors.inDepoNeutrals[5]} 100%
    );
    padding: ${({ theme }) => getREM(theme.default.spaces[3])};
`;

export const StyledRoomFooter = styled.div`
    width: 100%;
    height: ${({ theme }) => getREM(theme.default.spaces[9] * 3)};
    position: relative;
`;

export interface ContainerProps {
    visible: boolean;
    onClick?: () => void;
}

interface StyledLayoutCotainerProps extends Pick<ContainerProps, "visible"> {
    noBackground?: boolean;
}

export const StyledLayoutCotainer = styled.div<StyledLayoutCotainerProps>`
    height: 100%;
    width: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    flex: 0;
    opacity: 0;
    background: ${({ noBackground, theme }) => !noBackground && theme.colors.inDepoNeutrals[6]};
    border-radius: ${({ theme }) => getREM(theme.default.borderRadiusBase)};
    transition: flex 150ms ease 300ms;
    will-change: flex;
    ${({ noBackground, visible, theme }) => {
        return visible
            ? `
                width: unset;
                flex: 1;
                opacity: 1;
                padding: ${noBackground ? getREM(theme.default.spaces[1]) : getREM(theme.default.spaces[6])};
                margin-right: ${getREM(theme.default.spaces[3])};
            `
            : "";
    }}
`;

export const StyledLayoutContent = styled.div`
    height: 100%;
    overflow: hidden;
`;
