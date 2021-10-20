import React from "react";
import styled from "styled-components";
import Button from "@rl/prp-components-library/src/components/Button";

import { getREM, hexToRGBA } from "../../constants/styles/utils";

const circleButton = ({ isActive, ...props }) => <Button shape="circle" type="default" {...props} />;
const roundButton = ({ isActive, ...props }) => <Button type="default" {...props} />;

export const StyledCircleControl = styled(circleButton)`
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 2px 0 6px 0 ${({ theme }) => hexToRGBA(theme.colors.inDepoNeutrals[6], 0.57)};
    border: 0;
    transition: all 300ms ease-in-out;
    text-transform: capitalize;

    &,
    &:focus {
        background: ${({ theme, isActive }) => (isActive ? theme.colors.inDepoNeutrals[1] : theme.colors.inDepoRed[5])};
    }

    &:hover {
        background: ${({ theme, isActive }) => (isActive ? theme.colors.inDepoNeutrals[0] : theme.colors.inDepoRed[4])};
    }

    &:active {
        background: ${({ theme, isActive }) => (isActive ? theme.colors.inDepoNeutrals[2] : theme.colors.inDepoRed[6])};
    }

    & > :first-child {
        line-height: 0;
    }

    ${({ theme }) => `
        @media (max-width: ${theme.default.breakpoints.sm}) {
            && {
                min-width: ${getREM(theme.default.spaces[8] * 2)};
                height: ${getREM(theme.default.spaces[8] * 2)};
            }
        }
    `};
`;

export const StyledRoundedControl = styled(roundButton)`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: ${({ theme }) => `0 ${getREM(theme.default.spaces[5])}`};
    border: ${({ isActive, theme }) => (isActive ? `1px solid ${theme.default.primaryColor}` : "none")};
    text-transform: capitalize;
    &,
    &:focus {
        background-color: ${({ isActive, theme }) =>
            isActive ? theme.colors.inDepoNeutrals[4] : theme.colors.inDepoBlue[5]};
    }

    &:hover {
        background-color: ${({ isActive, theme }) =>
            isActive ? theme.colors.inDepoNeutrals[3] : theme.colors.inDepoBlue[4]};
    }

    &:active {
        background-color: ${({ isActive, theme }) =>
            isActive ? theme.colors.inDepoNeutrals[5] : theme.colors.inDepoBlue[6]};
    }
    &:disabled,
    &:disabled:hover {
        background-color: ${({ theme }) => theme.colors.inDepoNeutrals[5]};
        border-color: ${({ theme }) => theme.colors.inDepoNeutrals[5]};
        span {
            color: ${({ theme }) => theme.colors.disabled[9]};
        }
    }

    ${({ color, theme }) =>
        color === "red"
            ? `
                &,
                &:focus {
                    background-color: ${theme.colors.inDepoRed[5]};
                }

                &:hover {
                    background-color: ${theme.colors.inDepoRed[4]};
                }

                &:active {
                    background-color: ${theme.colors.inDepoRed[6]};
                }
            `
            : ""}

    path {
        fill: ${({ isActive, disabled, theme }) =>
            !disabled && (isActive ? theme.default.primaryColor : theme.default.whiteColor)};
    }

    & > :first-child {
        margin-bottom: -0.1rem;
        line-height: 0;
    }

    & > :last-child,
    & > span.anticon + span {
        margin-bottom: 0;
        margin-left: 0;
    }
`;

export const StyledRoundedButton = styled(StyledRoundedControl)`
    height: auto;
    min-width: ${({ theme }) => getREM(theme.default.spaces[6] * 4.5)};
    padding: ${({ theme }) => `${getREM(theme.default.spaces[3])} ${getREM(theme.default.spaces[6])}`};
    box-shadow: none;

    &,
    :focus {
        border: 1px solid ${({ isActive, theme }) => (isActive ? theme.default.primaryColor : "transparent")};
        background-color: ${({ isActive, theme }) => (isActive ? theme.colors.inDepoNeutrals[4] : "transparent")};
    }

    &:hover {
        border: 1px solid ${({ theme }) => theme.colors.primaryColor};
        background-color: ${({ theme }) => theme.colors.inDepoNeutrals[3]};
    }

    &:active {
        border: 1px solid ${({ theme }) => theme.colors.primaryColor};
        background-color: ${({ theme }) => theme.colors.inDepoNeutrals[4]};
    }

    & > :first-child {
        margin-bottom: 0.1rem;
    }

    & > :last-child,
    & > span.anticon + span {
        margin-bottom: 0;
        margin-left: 0;
    }

    ${({ color, theme }) =>
        color === "red"
            ? `
                &,
                &:focus {
                    border: unset;
                    background-color: ${theme.colors.inDepoRed[5]};
                }

                &:hover {
                    border: unset;
                    background-color: ${theme.colors.inDepoRed[4]};
                }

                &:active {
                    border: unset;
                    background-color: ${theme.colors.inDepoRed[6]};
                }
            `
            : ""}
`;
