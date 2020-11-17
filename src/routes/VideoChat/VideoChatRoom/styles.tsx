import styled from "styled-components";
import { getPX, getREM } from "../../../constants/styles/utils";

export const StyledInDepoContainer = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
`;

export const StyledVideoChatContainer = styled.div`
    display: flex;
    height: 100%;
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

export const StyledVideoConference = styled.div`
    height: 100%;
    display: flex;
`;

export const StyledDeponentContainer = styled.div`
    max-width: 100%;
    height: 100%;
    padding-right: ${({ theme }) => getPX(theme.default.spaces[3])};
`;

export const StyledAttendeesContainer = styled.div`
    width: auto;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding-right: ${({ theme }) => getREM(theme.default.spaces[2])};
    overflow: auto;
    scrollbar-color: ${({ theme }) => theme.colors.inDepoNeutrals[0]} ${({ theme }) => theme.colors.inDepoNeutrals[1]};
    scrollbar-width: thin;

    &::-webkit-scrollbar {
        width: ${({ theme }) => getPX(theme.default.spaces[0])};
    }

    &::-webkit-scrollbar-track {
        background-color: ${({ theme }) => theme.colors.inDepoNeutrals[1]};
    }
    &::-webkit-scrollbar-thumb {
        border-radius: ${({ theme }) => getPX(theme.default.spaces[5])};

        background: ${({ theme }) => theme.colors.inDepoNeutrals[0]};
    }
`;

export const StyledParticipantContainer = styled.div`
    width: auto;
    height: calc(25% - 12px);
    margin-top: ${({ theme }) => getREM(theme.default.spaces[3])};
    &:first-child {
        margin-top: 0;
    }
`;

export const StyledParticipantLoading = styled.div`
    color: #ffffff;
`;

