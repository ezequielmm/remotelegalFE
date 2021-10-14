import styled from "styled-components";
import { getPX, getREM } from "../../../constants/styles/utils";

const scroll = (theme) => `
    padding-right: ${getREM(theme.default.spaces[3])};
    scrollbar-color: ${theme.colors.inDepoNeutrals[9]} ${theme.colors.inDepoNeutrals[5]};
    scrollbar-width: thin;
    &::-webkit-scrollbar {
        background-color: ${theme.colors.inDepoNeutrals[5]};
    }
    &::-webkit-scrollbar:vertical {
        width: ${getPX(theme.default.spaces[2])};
    }
    &::-webkit-scrollbar:horizontal {
        height: ${getPX(theme.default.spaces[2])};
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
}>`
    ${({ participantsLength, layout, isBreakrooms, theme }) => {
        const participantStyle = () => {
            if (participantsLength === 1) {
                return `
                    height: auto;
                `;
            }
            if (participantsLength <= 4) {
                return `
                    height: calc(30% - ${getREM(theme.default.spaces[8])});
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

                        @-moz-document url-prefix() {
                            height: calc(25% - ${getREM(theme.default.spaces[6])});
                        }
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
                        height: calc(70% - ${getREM(theme.default.spaces[8])});
                    `;
                }
                if (participantsLength <= 4) {
                    return `
                    flex: 0 0 45%;
                    height: calc(50% - ${getREM(theme.default.spaces[8])});

                    @supports not (aspect-ratio: 16 / 8) {
                        flex: 0 0 40%;
                    }

                    @media (max-width: ${theme.default.breakpoints.md}) {
                        flex: 0 0 100%;
                    }
                    `;
                }
                return `
                    flex: 0 0 30%;
                    height: calc(33% - ${getREM(theme.default.spaces[8])});
                `;
            }

            return "";
        };

        return `
            position: relative;
            overflow: hidden;
            height: calc(25% - ${getREM(theme.default.spaces[8])});
            flex: 1 0 45%;
            display: flex;
            margin: ${getREM(theme.default.spaces[3])};
            
            @media (max-width: ${theme.default.breakpoints.md}) {
                height: max-content;
                width: 100%;
                flex: 1 0 100%;
                justify-content: center;
                margin-left: 0;
                margin-right: 0;
            }

            ${participantStyle()}
            ${layoutStyle()}
            ${breakroomsStyle()}
        `;
    }}
`;

export const StyledVideoConference = styled.div<{ show: boolean }>`
    width: 100%;
    max-height: 100%;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: 1fr;
    grid-gap: ${({ theme }) => getREM(theme.default.spaces[4])};
    justify-content: center;
    opacity: 0;
    transition: opacity 0ms ease;
    will-change: opacity;
    padding: ${({ theme }) => getREM(theme.default.spaces[6])};
    ${({ show }) =>
        show
            ? `
                transition: opacity 150ms ease;
                opacity: 1;
            `
            : ""}
    &.default {
        aspect-ratio: 16 / 8;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        @supports not (aspect-ratio: 16 / 9) {
            height: 100%;
            align-content: center;
        }

        @-moz-document url-prefix() {
            height: 100%;
            width: auto;
            max-width: 100%;
        }

        @media (max-width: ${({ theme }) => theme.default.breakpoints.lg}) {
            height: 100%;
            aspect-ratio: unset;
            overflow-y: auto;
            overflow-x: hidden;
            display: block;
            padding: 0;
            ${({ theme }) => scroll(theme)}
        }

        @media (max-width: ${({ theme }) => theme.default.breakpoints.md}) {
            width: 100%;
            overflow-y: scroll;
        }

        &.breakrooms {
            aspect-ratio: 16 / 9;
            grid-template-columns: 1fr;

            @supports not (aspect-ratio: 16 / 9) {
                height: 100%;
            }
        }
    }
    &.vertical {
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 1fr 4fr;
        grid-gap: ${({ theme }) => getREM(theme.default.spaces[4])};
    }

    &.grid {
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 1fr 1fr;
        grid-gap: ${({ theme }) => getREM(theme.default.spaces[4])};
    }
`;

export const StyledVideoConferenceWrapper = styled.div<{ layout: string }>`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    flex: 1 1 40%;
    position: relative;

    & > .aspect-ratio {
        display: none;
    }

    @supports not (aspect-ratio: 1) {
        ${({ layout, theme }) =>
            layout === "default"
                ? `
                max-width: max-content;
                overflow: hidden;

                & > .aspect-ratio {
                    height: 100%;
                    width: auto;
                    max-width: 100%;
                    display: block;
                }

                @media (max-width: ${theme.default.breakpoints.xl}) {
                    width: 100%;
                    height: 100%;
                    max-height: max-content;
                    max-width: unset;
                    top: calc(50vh - 3.5rem);
                    left: 50vw;
                    transform: translate(-50%, -50%);

                    & > .aspect-ratio {
                        width: 100%;
                        height: intrinsic;
                    }
                }

                @media (max-width: ${theme.default.breakpoints.lg}) {
                    max-height: unset;

                    & > .aspect-ratio {
                        display: none;
                    }
                }

                @media (max-width: ${theme.default.breakpoints.md}) {
                    overflow-y: unset;
                }
                `
                : ""};

        ${({ layout }) =>
            layout === "grid"
                ? `
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
                }
                `
                : ""}
    }
`;

export const StyledDeponentContainer = styled.div<{ isSingle: boolean }>`
    width: 100%;
    display: flex;
    align-items: center;
    grid-column: 1 / 2;

    ${StyledVideoConference}.default & {
        .aspect-ratio {
            width: 100%;
        }

        @media (max-width: ${({ theme }) => theme.default.breakpoints.md}) {
            margin-bottom: ${({ theme }) => getREM(theme.default.spaces[3])};
        }
    }

    ${StyledVideoConference}.grid & {
        .aspect-ratio {
            width: auto;
        }
    }

    ${StyledVideoConference}.vertical &, ${StyledVideoConference}.grid & {
        grid-column: auto;
    }

    ${StyledVideoConference}.vertical & {
        justify-content: center;
    }
`;

export const StyledAttendeesContainer = styled.div<{
    participantsLength: number;
    layout: string;
    isBreakroom: boolean;
}>`
    grid-column: ${({ isBreakroom }) => (isBreakroom ? "auto" : "2 / main-end")};
    overflow-y: auto;
    overflow-x: hidden;
    display: flex;
    flex-wrap: wrap;
    align-content: ${({ participantsLength }) => (participantsLength > 8 ? "flex-start" : "center")};
    align-items: center;

    @media (max-width: ${({ theme }) => theme.default.breakpoints.lg}) {
        margin-left: 0;
        align-content: ${({ participantsLength }) => (participantsLength > 3 ? "flex-start" : "center")};
        overflow: hidden;
    }

    @media (max-width: ${({ theme }) => theme.default.breakpoints.xl}) {
        height: 100%;
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
                    grid-gap: ${getREM(theme.default.spaces[4])};
                    grid-column: auto;
                    ${participantsLength > 6 ? scroll(theme) : ""}
                }
                `
                : "";

        const verticalStyle =
            layout === "vertical"
                ? `
                    grid-column: auto;
                    align-content: flex-start;
                    ${participantsLength > 4 ? scroll(theme) : ""}
                `
                : "";

        const defaultStyle =
            layout === "default"
                ? `
                @-moz-document url-prefix() {
                    height: 100%;
                }

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
                @media (max-width: ${theme.default.breakpoints.md}) {
                    height: max-content;
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
