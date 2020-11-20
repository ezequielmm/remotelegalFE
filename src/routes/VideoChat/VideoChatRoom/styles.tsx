import styled from "styled-components";
import { getREM } from "../../../constants/styles/utils";

export const StyledInDepoContainer = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
`;

export const StyledInDepoLayout = styled.div`
    display: flex;
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
