import styled, { createGlobalStyle } from "styled-components";
import { getREM } from "../../constants/styles/utils";

export const GlobalStylesInDepo = createGlobalStyle`
    html, body {
        background: ${({ theme }) => theme.colors.inDepoNeutrals[10]};
    }
`;

export const StyledInDepoContainer = styled.div<{ height?: number }>`
    width: 100vw;
    height: ${({ height }) => (height ? `${height}px` : "100vh")};
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
    background: ${({ theme }) => theme.colors.inDepoNeutrals[10]};
`;

export const StyledInDepoLayout = styled.div`
    height: calc(100% - ${({ theme }) => getREM(theme.default.spaces[9] * 3)});
    position: relative;
    display: flex;
    justify-content: center;
    padding: ${({ theme }) => getREM(theme.default.spaces[3])};

    @media (max-width: ${({ theme }) => theme.default.breakpoints.lg}) {
        padding-bottom: 0;
    }
`;

export const StyledRoomFooter = styled.div`
    width: 100%;
    height: ${({ theme }) => getREM(theme.default.spaces[9] * 3)};

    @media (max-width: ${({ theme }) => theme.default.breakpoints.lg}) {
        position: fixed;
        bottom: 0;
    }
`;

export interface ContainerProps {
    onClick?: () => void;
}

interface StyledLayoutCotainerProps extends ContainerProps {
    noBackground?: boolean;
    visible?: boolean;
}

export const StyledLayoutCotainer = styled.div<StyledLayoutCotainerProps>`
    height: 100%;
    overflow: hidden;
    display: ${({ visible }) => (visible === false ? "none" : "flex")};
    flex-direction: column;
    flex: ${({ visible }) => (visible === false ? 0 : "1 0 40%")};
    background: ${({ noBackground, theme }) => !noBackground && theme.colors.inDepoNeutrals[6]};
    margin-right: ${({ theme }) => getREM(theme.default.spaces[3])};
    padding: ${({ noBackground, theme }) =>
        noBackground ? getREM(theme.default.spaces[1]) : getREM(theme.default.spaces[6])};
    border-radius: ${({ theme }) => getREM(theme.default.borderRadiusBase)};
`;

export const StyledLayoutContent = styled.div`
    height: 100%;
    overflow: hidden;
`;
