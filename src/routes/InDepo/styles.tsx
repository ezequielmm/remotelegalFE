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
    background: ${({ theme }) => theme.colors.inDepoNeutrals[10]};
    padding: ${({ theme }) => getREM(theme.default.spaces[3])};
`;

export const StyledRoomFooter = styled.div`
    width: 100%;
    height: ${({ theme }) => getREM(theme.default.spaces[9] * 3)};
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
