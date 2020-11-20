import styled from "styled-components";
import { getPX, getREM } from "../../constants/styles/utils";

export const StyledVideoConference = styled.div`
    height: 100%;
    display: flex;
    flex: 1 1 0%;

    &.grid,
    &.vertical {
        flex-direction: column;
    }

    &.vertical {
        flex: unset;
    }
`;

export const StyledVideoChatContainer = styled.div`
    display: flex;
    height: 100%;
`;

export const StyledDeponentContainer = styled.div`
    max-width: 100%;
    height: 100%;
    padding-right: ${({ theme }) => getREM(theme.default.spaces[3])};

    ${StyledVideoConference}.grid & {
        video {
            width: 100%;
            height: auto;
        }
    }

    ${StyledVideoConference}.vertical & {
        height: calc(20% - ${({ theme }) => getREM((theme.default.spaces[3] * 4) / 5)});
    }
`;

export const StyledAttendeesContainer = styled.div`
    width: auto;
    height: 100%;
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

    ${StyledVideoConference}.grid &,
    ${StyledVideoConference}.vertical & {
        margin-top: ${({ theme }) => getREM(theme.default.spaces[3])};
    }

    ${StyledVideoConference}.vertical & {
        height: 80%;
    }
`;

export const StyledParticipantContainer = styled.div`
    width: auto;
    height: calc(25% - ${({ theme }) => getREM((theme.default.spaces[3] * 3) / 4)});
    margin-top: ${({ theme }) => getREM(theme.default.spaces[3])};
    &:first-child {
        margin-top: 0;
    }

    ${StyledVideoConference}.grid & {
        height: auto;
        width: calc(33.3333% - ${({ theme }) => getREM((theme.default.spaces[3] * 2) / 3)});
        margin-left: ${({ theme }) => getREM(theme.default.spaces[3])};
        display: inline-flex;

        &:nth-child(3n + 1) {
            margin-left: 0;
        }

        &:nth-child(-n + 3) {
            margin-top: 0;
        }

        video {
            width: 100%;
            height: auto;
        }
    }

    ${StyledVideoConference}.vertical & {
        height: calc(25% - ${({ theme }) => getREM((theme.default.spaces[3] * 4) / 5)});
    }
`;
