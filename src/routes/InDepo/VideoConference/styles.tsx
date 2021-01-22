import styled from "styled-components";
import { getPX, getREM } from "../../../constants/styles/utils";

export const StyledVideoConference = styled.div`
    height: 100%;
    display: flex;
    justify-content: center;
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

interface VideoContainerProps {
    height: string | undefined;
}

export const StyledDeponentContainer = styled.div<VideoContainerProps>`
    max-width: 100%;
    height: ${({ height }) => height || "100%"};
    padding-right: ${({ theme }) => getREM(theme.default.spaces[6])};
    ${StyledVideoConference}.grid & {
        display: flex;
        justify-content: center;
        & > div {
            width: auto;
        }
        img {
            width: auto;
            height: 100%;
        }
    }
    ${StyledVideoConference}.vertical & {
        height: calc(20% - ${({ theme }) => getREM((theme.default.spaces[5] * 4) / 5)});
    }
`;

export const StyledAttendeesContainer = styled.div<VideoContainerProps>`
    width: auto;
    height: ${({ height }) => height || "100%"};
    padding-right: ${({ theme }) => getREM(theme.default.spaces[5])};
    overflow: auto;
    scrollbar-color: ${({ theme }) => theme.colors.inDepoNeutrals[0]} ${({ theme }) => theme.colors.inDepoNeutrals[1]};
    scrollbar-width: thin;
    &::-webkit-scrollbar {
        width: ${({ theme }) => getPX(theme.default.spaces[1])};
    }
    &::-webkit-scrollbar-track {
        background-color: ${({ theme }) => theme.colors.inDepoNeutrals[1]};
    }
    &::-webkit-scrollbar-thumb {
        border-radius: ${({ theme }) => getPX(theme.default.spaces[7])};
        background: ${({ theme }) => theme.colors.inDepoNeutrals[0]};
    }
    ${StyledVideoConference}.grid &,
    ${StyledVideoConference}.vertical & {
        margin-top: ${({ theme }) => getREM(theme.default.spaces[5])};
    }
    ${StyledVideoConference}.vertical & {
        height: 80%;
    }
`;

export const StyledParticipantContainer = styled.div<{ isUnique: boolean }>`
    width: ${({ isUnique }) => (isUnique ? "100%" : "100%")};
    height: ${({ isUnique, theme }) =>
        isUnique ? "100%" : `calc(25% - ${getREM((theme.default.spaces[5] * 3) / 4)})`};
    margin-top: ${({ theme }) => getREM(theme.default.spaces[5])};
    &:first-child {
        margin-top: 0;
    }
    ${StyledVideoConference}.grid & {
        height: auto;
        width: calc(33.3333% - ${({ theme }) => getREM((theme.default.spaces[5] * 2) / 3)});
        margin-left: ${({ theme }) => getREM(theme.default.spaces[5])};
        display: inline-flex;
        &:nth-child(3n + 1) {
            margin-left: 0;
        }
        &:nth-child(-n + 3) {
            margin-top: 0;
        }
        img {
            width: 100%;
            height: auto;
        }
    }
    ${StyledVideoConference}.vertical & {
        height: calc(25% - ${({ theme }) => getREM((theme.default.spaces[5] * 4) / 5)});
    }
`;
