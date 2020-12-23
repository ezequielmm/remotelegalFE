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
    display: flex;
    position: relative;
    justify-content: center;
    height: calc(100% - ${({ theme }) => getREM(theme.default.spaces[5] * 3)});
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
    height: ${({ theme }) => getREM(theme.default.spaces[5] * 3)};
`;

export interface ContainerProps {
    visible: boolean;
    onClick?: () => void;
}

interface StyledLayoutCotainerProps extends Pick<ContainerProps, "visible"> {}

export const StyledLayoutCotainer = styled.div<StyledLayoutCotainerProps>`
    display: flex;
    flex-direction: column;
    height: 100%;
    flex: 1 1 0%;
    padding: ${({ theme }) => `${getREM(theme.default.spaces[3])}`};
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

export const StyledLayoutHeader = styled.div`
    display: flex;
    justify-content: space-between;
    flex-direction: row-reverse;
    width: 100%;
    padding-bottom: ${({ theme }) => getREM(theme.default.spaces[3])};
`;

export const StyledLayoutContent = styled.div`
    height: 100%;
    padding: ${({ theme }) => `0 ${getREM(theme.default.spaces[1])}`};
    overflow: hidden;
`;
