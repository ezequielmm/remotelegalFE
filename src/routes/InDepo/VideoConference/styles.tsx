import styled from "styled-components";
import { getPX, getREM } from "../../../constants/styles/utils";

interface IVideoConferenceProps {
    show: boolean;
}

export const StyledVideoConference = styled.div<IVideoConferenceProps>`
    height: 100%;
    display: flex;
    justify-content: center;
    flex: 1;
    opacity: 0;
    transition: opacity 0ms ease;
    will-change: opacity;
    ${({ show }) =>
        show
            ? `
                transition: opacity 150ms ease;
                opacity: 1;
            `
            : ""}
    &.grid,
    &.vertical {
        flex-direction: column;
    }
    &.vertical {
        flex: 0.5;
    }
`;

export const StyledDeponentContainer = styled.div<{ isUnique: boolean }>`
    height: 100%;
    max-width: 100%;
    display: flex;
    flex: ${({ isUnique }) => (isUnique ? 0 : 3)};
    ${StyledVideoConference}.grid &, ${StyledVideoConference}.vertical & {
        flex: 1;
        justify-content: center;
    }
`;

interface IAtendeesContainerProps {
    participantsLength: number;
}

export const StyledAttendeesContainer = styled.div<IAtendeesContainerProps>`
    height: 100%;
    width: auto;
    overflow: auto;
    flex: 1;
    display: grid;
    grid-auto-rows: calc(25% - ${({ theme }) => getREM((theme.default.spaces[6] * 2) / 5)});
    grid-gap: ${({ theme }) => getREM(theme.default.spaces[3])};
    margin-left: ${({ theme }) => getREM(theme.default.spaces[3])};
    ${({ participantsLength, theme }) => {
        const scroll = `
            padding-right: ${getREM(theme.default.spaces[3])};
            scrollbar-color: ${theme.colors.inDepoNeutrals[9]} ${theme.colors.inDepoNeutrals[5]};
            scrollbar-width: thin;
            &::-webkit-scrollbar {
                width: ${getPX(theme.default.spaces[2])};
            }
            &::-webkit-scrollbar-track {
                background-color: ${theme.colors.inDepoNeutrals[5]};
                border-radius: ${getPX(theme.default.spaces[7])};
            }
            &::-webkit-scrollbar-thumb {
                border-radius: ${getPX(theme.default.spaces[7])};
                background: ${theme.colors.inDepoNeutrals[9]};
            }
        `;
        if (participantsLength > 6) {
            return `
                ${scroll}
            `;
        }
        if (participantsLength > 4) {
            return `
                ${StyledVideoConference}:not(.grid) & {
                    ${scroll}
                }
            `;
        }
    }}
    ${StyledVideoConference}.grid & {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-auto-rows: calc(50% - ${({ theme }) => getREM(theme.default.spaces[2])});
        grid-gap: ${({ theme }) => getREM(theme.default.spaces[3])};
        margin-top: ${({ theme }) => getREM(theme.default.spaces[3])};
        margin-left: 0;
    }
    ${StyledVideoConference}.vertical & {
        margin-top: ${({ theme }) => getREM(theme.default.spaces[3])};
        margin-left: 0;
        flex: 4;
    }
    ${StyledVideoConference}.breakrooms & {
        grid-template-columns: repeat(auto-fit, minmax(30%, 1fr));
        grid-auto-rows: minmax(calc(33% - ${({ theme }) => getREM(theme.default.spaces[2])}), 1fr);
    }
    ${StyledVideoConference}.breakrooms.grid & {
        margin-top: 0;
        grid-auto-rows: minmax(calc(25% - ${({ theme }) => getREM(theme.default.spaces[3])}), 1fr);
    }
`;

export const StyledParticipantContainer = styled.div`
    position: relative;
    overflow: hidden;
    ${StyledVideoConference}.grid & {
        max-height: 100%;
    }
`;
