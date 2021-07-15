import styled from "styled-components";
import { getPX, getREM } from "../../../constants/styles/utils";

interface IVideoConferenceProps {
    show: boolean;
}

export const StyledParticipantContainer = styled.div`
    position: relative;
    overflow: hidden;
`;

export const StyledVideoConference = styled.div<IVideoConferenceProps>`
    width: 100%;
    max-height: 100%;
    display: flex;
    justify-content: center;
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

            &.breakrooms {
                aspect-ratio: 16 / 9;
            }

            &:not(.breakrooms) ${StyledParticipantContainer} {
                &:nth-child(odd) {
                    justify-content: flex-end;
                    &:last-child {
                        justify-content: center;
                    }
                }
            }
        }

        ${StyledParticipantContainer} {
            height: calc(25% - ${({ theme }) => getREM(theme.default.spaces[6])});
            flex: 1 0 45%;
            display: flex;
            margin: ${({ theme }) => getREM(theme.default.spaces[3])};
        }
    }
    &.vertical {
        aspect-ratio: 5 / 13;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        flex-direction: column;
        ${StyledParticipantContainer} {
            height: calc(25% - ${({ theme }) => getREM(theme.default.spaces[6])});
            margin-left: 0;
            flex: 1 0 100%;
        }
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

        ${StyledParticipantContainer} {
            height: 100%;
        }
    }
`;

export const StyledVideoConferenceWrapper = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    flex: 1 1 50%;
    position: relative;

    & > ${StyledVideoConference}.vertical {
        flex: 1 1 20%;
    }
`;

export const StyledDeponentContainer = styled.div<{ isUnique: boolean }>`
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    flex: ${({ isUnique }) => (isUnique ? 0 : 6)};
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
    overflow-y: auto;
    overflow-x: hidden;
    display: flex;
    flex-wrap: wrap;
    flex: 6;
    align-content: center;
    align-items: center;
    margin-left: ${({ theme }) => getREM(theme.default.spaces[3])};
    ${({ participantsLength, theme }) => {
        const scroll = `
            align-content: flex-start;
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
        if (participantsLength > 8) {
            return `
                ${StyledVideoConference}:not(.vertical):not(.grid) & {
                    flex: 5;
                }

                ${StyledVideoConference}.grid && {
                    grid-auto-rows: calc(50% - ${getREM(theme.default.spaces[4])});
                }
                
                ${StyledVideoConference}.vertical & {
                    ${StyledParticipantContainer} {
                        height: calc(25% - ${getREM(theme.default.spaces[6])});
                    }
                }

                ${StyledVideoConference}.breakrooms & {
                    ${StyledParticipantContainer} {
                        flex: 0 0 30%;
                        height: calc(33% - ${getREM(theme.default.spaces[6])});
                    }
                }

                ${scroll}
            `;
        }
        if (participantsLength > 6) {
            return `
                ${StyledVideoConference}:not(.vertical):not(.grid) & {
                    flex: 5;
                }
                
                ${StyledVideoConference}.grid && {
                    grid-auto-rows: calc(50% - ${getREM(theme.default.spaces[4])});
                }

                ${StyledVideoConference}.vertical & {
                    ${StyledParticipantContainer} {
                        height: calc(25% - ${getREM(theme.default.spaces[6])});
                    }
                }

                ${StyledVideoConference}.breakrooms & {
                    ${StyledParticipantContainer} {
                        flex: 0 0 30%;
                        height: calc(33% - ${getREM(theme.default.spaces[6])});
                    }
                }

                ${scroll}
            `;
        }
        if (participantsLength > 4) {
            return `
                ${StyledVideoConference}:not(.vertical):not(.grid) & {
                    flex: 6;
                    
                    ${StyledParticipantContainer} {
                        height: calc(30% - ${getREM(theme.default.spaces[6])});
                    }
                }

                ${StyledVideoConference}.vertical & {
                    ${scroll}

                    ${StyledParticipantContainer} {
                        height: calc(25% - ${getREM(theme.default.spaces[6])});
                    }
                }

                ${StyledVideoConference}.breakrooms & {
                    ${StyledParticipantContainer} {
                        flex: 0 0 30%;
                        height: calc(33% - ${getREM(theme.default.spaces[6])});
                    }
                }
            `;
        }
        if (participantsLength > 1) {
            return `
                ${StyledVideoConference}.default & {
                    flex: 6;
                    
                    ${StyledParticipantContainer} {
                        height: calc(30% - ${getREM(theme.default.spaces[6])});
                    }
                }

                ${StyledVideoConference}.vertical & {
                    ${StyledParticipantContainer} {
                        margin-left: ${getREM(theme.default.spaces[3])};
                    }
                }
                
                ${StyledVideoConference}.breakrooms & {
                    ${StyledParticipantContainer} {
                        flex: 0 0 45%;
                        height: calc(50% - ${getREM(theme.default.spaces[6])});
                    }
                }
            `;
        }
        if (participantsLength < 2) {
            return `
                ${StyledVideoConference}:not(.vertical):not(.grid):not(.breakrooms) & {
                    flex: 6;
                    ${StyledParticipantContainer} {
                        height: auto;
                        > * {
                            width: 100%;

                            img {
                                max-height: 100%;
                                width: 100%;
                            }
                        }
                    }
                }

                ${StyledVideoConference}.vertical & {
                    ${StyledParticipantContainer} {
                        margin-left: ${getREM(theme.default.spaces[3])};
                    }
                }

                ${StyledVideoConference}.breakrooms & {
                    ${StyledParticipantContainer} {
                        flex: 0 0 45%;
                        height: calc(50% - ${getREM(theme.default.spaces[6])});
                    }
                }
            `;
        }
    }}
    ${StyledVideoConference}.grid & {
        display: grid;
        align-content: flex-start;
        grid-template-columns: repeat(3, 1fr);
        grid-auto-rows: calc(50% - ${({ theme }) => getREM(theme.default.spaces[3])});
        grid-gap: ${({ theme }) => getREM(theme.default.spaces[6])};
        margin-top: ${({ theme }) => getREM(theme.default.spaces[6])};
        margin-left: 0;
    }
    ${StyledVideoConference}.vertical & {
        align-content: flex-start;
        margin-top: ${({ theme }) => getREM(theme.default.spaces[3])};
        margin-left: 0;
        flex: 4;
    }
    ${StyledVideoConference}.breakrooms & {
        margin-left: 0;
        justify-content: center;
    }
    ${StyledVideoConference}.breakrooms.grid & {
        margin-top: 0;
        grid-auto-rows: minmax(calc(25% - ${({ theme }) => getREM(theme.default.spaces[3])}), 1fr);
    }
`;
