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
    height: calc(100% - 72px);
    background: linear-gradient(
        to bottom,
        ${({ theme }) => theme.colors.inDepo[2]} 0%,
        ${({ theme }) => theme.colors.inDepo[2]} 60%,
        ${({ theme }) => theme.colors.inDepo[1]} 100%
    );
    padding: ${({ theme }) => getREM(theme.default.spaces[3])};
`;

export const StyledRoomFooter = styled.div`
    width: 100%;
    height: 72px;
    background-color: ${({ theme }) => theme.colors.inDepo[1]};
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
    scrollbar-color: ${({ theme }) => theme.colors.inDepo[3]} ${({ theme }) => theme.colors.inDepo[1]};
    scrollbar-width: thin;

    &::-webkit-scrollbar {
        width: ${({ theme }) => getPX(theme.default.spaces[0])};
    }

    &::-webkit-scrollbar-track {
        background-color: ${({ theme }) => theme.colors.inDepo[1]};
    }
    &::-webkit-scrollbar-thumb {
        border-radius: ${({ theme }) => getPX(theme.default.spaces[5])};

        background: ${({ theme }) => theme.colors.inDepo[3]};
    }
`;

export const StyledParticipantContainer = styled.div`
    width: auto;
    height: calc(25% - ${({ theme }) => getPX(theme.default.spaces[3])});
    margin-bottom: ${({ theme }) => getREM(theme.default.spaces[3])};
    &:last-child {
        margin-bottom: 0;
    }
`;
