import styled, { css } from "styled-components";
import { getPX, getREM } from "../../../constants/styles/utils";

const scroll = (theme) => css`
    padding-right: ${getREM(theme.default.spaces[3])};
    scrollbar-color: ${theme.colors.inDepoNeutrals[9]} ${theme.colors.inDepoNeutrals[5]};
    scrollbar-width: thin;
    &::-webkit-scrollbar {
        -webkit-appearance: none;
        width: ${getPX(theme.default.spaces[2])};
        height: ${getPX(theme.default.spaces[2])};
        background-color: ${theme.colors.inDepoNeutrals[5]};
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

export const StyledParticipantContainer = styled.div<{
    participantsLength: number;
    layout: string;
    isBreakrooms: boolean;
    isWitness: boolean;
}>`
    ${({ participantsLength, layout, isBreakrooms, isWitness, theme }) => {
        const participantStyle = () => {
            if (participantsLength === 1) {
                return `
                    height: auto;
                `;
            }
            if (participantsLength <= 4) {
                return `
                    height: calc(30% - ${getREM(theme.default.spaces[6])});
                `;
            }
            return `
                    height: calc(25% - ${getREM(theme.default.spaces[6])});
                `;
        };

        const layoutStyle = () => {
            switch (layout) {
                case "vertical":
                    return `
                        height: calc(25% - ${getREM(theme.default.spaces[6])});
                        margin-left: 0;
                        flex: 1 0 100%;
                    `;
                case "grid":
                    return `
                        height: 100%;
                        margin: 0;
                    `;
                default:
                    return !isBreakrooms
                        ? `
                            @media (min-width: ${theme.default.breakpoints.lg}) {
                                &:nth-child(odd) {
                                    justify-content: flex-end;
                                    &:last-child {
                                        justify-content: center;
                                    }
                                }
                            }
                        `
                        : "";
            }
        };

        const breakroomsStyle = () => {
            if (isBreakrooms) {
                if (participantsLength === 1) {
                    return `
                        flex: 0 0 65%;
                        height: calc(70% - ${getREM(theme.default.spaces[6])});
                    `;
                }
                if (participantsLength <= 4) {
                    return `
                    flex: 0 0 45%;
                    height: calc(50% - ${getREM(theme.default.spaces[6])});
                    `;
                }
                return `
                    flex: 0 0 30%;
                    height: calc(33% - ${getREM(theme.default.spaces[6])});
                `;
            }

            return "";
        };

        return `
            position: relative;
            overflow: hidden;
            height: calc(25% - ${getREM(theme.default.spaces[6])});
            flex: 1 0 45%;
            display: flex;
            margin: ${getREM(theme.default.spaces[3])};
            order: ${isWitness ? -1 : 1};

            ${participantStyle()}
            ${layoutStyle()}
            ${breakroomsStyle()}

            @media (max-width: ${theme.default.breakpoints.lg}) {
                height: calc(30vh - ${getREM(theme.default.spaces[6])});
                flex: 1 0 100%;
                justify-content: center;
                margin-left: 0;
                margin-right: 0;
            }
        `;
    }}
`;

export const StyledVideoConference = styled.div<{ show: boolean }>`
    width: 100%;
    max-height: 100%;
    display: flex;
    justify-content: center;
    flex: 1;
    opacity: 0;
    transition: opacity 0ms ease;
    will-change: opacity;
    padding: ${({ theme }) => getREM(theme.default.spaces[9])};
    ${({ show }) =>
        show
            ? `
                transition: opacity 150ms ease;
                opacity: 1;
            `
            : ""}
    &:not(.grid) {
        &:not(.vertical) {
            aspect-ratio: 16 / 8;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);

            @media (max-width: ${({ theme }) => theme.default.breakpoints.lg}) {
                height: 100%;
                aspect-ratio: unset;
                overflow-y: auto;
                overflow-x: hidden;
                display: block;
                padding: 0;
                ${({ theme }) => scroll(theme)}
            }

            @media (min-width: ${({ theme }) => theme.default.breakpoints.lg}) {
                @supports not (aspect-ratio: 16 / 8) {
                    &::before {
                        float: left;
                        padding-top: 50%;
                        content: "";
                    }
                    &::after {
                        display: block;
                        content: "";
                        clear: both;
                    }
                }
            }

            &.breakrooms {
                aspect-ratio: 16 / 9;

                @supports not (aspect-ratio: 16 / 9) {
                    max-width: calc(156vh);

                    &::before {
                        float: left;
                        padding-top: 56.25%;
                        content: "";
                    }
                    &::after {
                        display: block;
                        content: "";
                        clear: both;
                    }
                }
            }
        }
    }
    &.vertical {
        @supports (aspect-ratio: 6 / 16) {
            aspect-ratio: 6 / 16;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }

        padding: ${({ theme }) =>
            `${getREM(theme.default.spaces[6])} ${getREM(theme.default.spaces[7] + theme.default.spaces[3])}`};

        flex-direction: column;
    }

    &.grid {
        aspect-ratio: 1;
        position: absolute;
        max-height: 100%;
        padding: ${({ theme }) =>
            `${getREM(theme.default.spaces[12] + theme.default.spaces[2])} ${getREM(
                theme.default.spaces[7] + theme.default.spaces[3]
            )}`};
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        flex-direction: column;
    }
`;

export const StyledVideoConferenceWrapper = styled.div<{ isGridLayout: boolean }>`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    flex: 1 1 40%;
    position: relative;

    & > ${StyledVideoConference}.vertical {
        flex: 1 1 20%;

        @supports not (aspect-ratio: 1) {
            max-height: 50vw;
        }
    }

    ${({ isGridLayout }) =>
        isGridLayout
            ? `
                @supports not (aspect-ratio: 1) {
                    max-height: 100%;
                    max-width: calc(100vh - 5.5rem); // ControlsBar height

                    &::before {
                        float: left;
                        padding-top: 100%;
                        content: "";
                    }
                    &::after {
                        display: block;
                        content: "";
                        clear: both;
                    }

                    & > ${StyledVideoConference}.grid {
                        height: -moz-available;
                        height: -webkit-fill-available;
                        max-height: 50vw;
                    }
                }
            `
            : ""}
`;

export const StyledDeponentContainer = styled.div<{ isSingle: boolean }>`
    width: 100%;
    display: flex;
    flex: ${({ isSingle }) => (isSingle ? 0 : "6 1 35%")};
    align-items: center;
    ${StyledVideoConference}.grid & {
        flex: 1 0 56%;
        justify-content: center;
    }
    ${StyledVideoConference}.vertical & {
        flex: 1;
        justify-content: center;
    }

    @media (max-width: ${({ theme }) => theme.default.breakpoints.lg}) {
        display: none;
    }
`;

export const StyledAttendeesContainer = styled.div<{ participantsLength: number; layout: string }>`
    width: auto;
    overflow-y: auto;
    overflow-x: hidden;
    display: flex;
    flex: ${({ participantsLength }) => (participantsLength > 4 ? "5 0 35%" : "6 0 35%")};
    flex-wrap: wrap;
    align-content: ${({ participantsLength }) => (participantsLength > 8 ? "flex-start" : "center")};
    align-items: center;
    margin-left: ${({ theme }) => getREM(theme.default.spaces[3])};

    @media (max-width: ${({ theme }) => theme.default.breakpoints.lg}) {
        flex: 1;
        margin-left: 0;
        align-content: ${({ participantsLength }) => (participantsLength > 3 ? "flex-start" : "center")};
        overflow: hidden;
    }

    ${({ participantsLength, layout, theme }) => {
        const gridStyle =
            layout === "grid"
                ? `
                ${StyledVideoConference}.grid & {
                    display: grid;
                    align-content: flex-start;
                    grid-template-columns: repeat(3, 1fr);
                    grid-auto-rows: ${
                        participantsLength > 6
                            ? `calc(50% - ${getREM(theme.default.spaces[4])})`
                            : `calc(50% - ${getREM(theme.default.spaces[3])})`
                    };
                    grid-gap: ${getREM(theme.default.spaces[6])};
                    margin-top: ${getREM(theme.default.spaces[6])};
                    margin-left: 0;
                    ${participantsLength > 6 ? scroll(theme) : ""}
                }
                `
                : "";

        const verticalStyle =
            layout === "vertical"
                ? `
                    align-content: flex-start;
                    margin-top: ${getREM(theme.default.spaces[3])};
                    margin-left: 0;
                    flex: 4;
                    ${participantsLength > 4 ? scroll(theme) : ""}
                `
                : "";

        const defaultStyle =
            layout === "default"
                ? `
                @media (min-width: ${theme.default.breakpoints.lg}) {
                    ${participantsLength > 8 ? scroll(theme) : ""}

                    ${StyledVideoConference}.breakrooms & {
                        margin-left: 0;
                        justify-content: center;
                        ${participantsLength > 9 ? scroll(theme) : ""}
                    }
                    ${StyledVideoConference}.breakrooms.grid & {
                        margin-top: 0;
                        grid-auto-rows: minmax(calc(25% - ${getREM(theme.default.spaces[3])}), 1fr);
                    }
                }
                `
                : "";

        return `
                ${defaultStyle}
                ${gridStyle}
                ${verticalStyle}
        `;
    }}
`;
