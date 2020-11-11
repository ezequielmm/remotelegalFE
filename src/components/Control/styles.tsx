import React from "react";
import { Button } from "antd";
import styled from "styled-components";
import { getREM } from "../../constants/styles/utils";

const circleButton = ({ isToggled, ...props }) => <Button shape="circle" type="default" {...props} />;
const roundButton = ({ isToggled, ...props }) => <Button type="default" {...props} />;

export const StyledCircleControl = styled(circleButton)`
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 2px 0 6px 0 rgba(13, 30, 44, 0.57); // TODO hex to rgba inDepoNeutrals[5]
    border: 0;
    transition: all 300ms ease-in-out;

    &,
    &:focus {
        background: ${({ theme, isToggled }) =>
            isToggled ? theme.colors.inDepoNeutrals[2] : theme.colors.inDepoNeutrals[1]};
    }

    &:hover {
        background: ${({ theme }) => theme.colors.inDepoNeutrals[0]};
    }

    &:active {
        background: ${({ theme }) => theme.colors.inDepoNeutrals[2]};
    }

    & > :first-child {
        line-height: 0;
    }
`;

export const StyledRoundedControl = styled(roundButton)`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: ${({ theme }) => `0 ${getREM(theme.default.spaces[2])}`}; // TODO refactor spacing
    border: ${({ isToggled, theme }) => (isToggled ? `1px solid ${theme.default.primaryColor}` : "none")};

    &,
    &:focus {
        background-color: ${({ isToggled, theme }) =>
            isToggled ? theme.colors.inDepoNeutrals[4] : theme.colors.inDepoBlue[5]};
    }

    &:hover {
        background-color: ${({ isToggled, theme }) =>
            isToggled ? theme.colors.inDepoNeutrals[3] : theme.colors.inDepoBlue[4]};
    }

    &:active {
        background-color: ${({ isToggled, theme }) =>
            isToggled ? theme.colors.inDepoNeutrals[5] : theme.colors.inDepoBlue[6]};
    }

    path {
        fill: ${({ isToggled, theme }) => (isToggled ? theme.default.primaryColor : theme.default.whiteColor)};
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

    &:hover,
    :active,
    :focus {
        background: #0b649c;
    }
`;

export const StyledRoundedButton = styled(StyledRoundedControl)`
    height: auto;
    padding: ${({ theme }) => `${getREM(theme.default.spaces[1])} ${getREM(theme.default.spaces[3])}`};
    box-shadow: none;

    &,
    :focus {
        border: 1px solid ${({ isToggled, theme }) => (isToggled ? theme.default.primaryColor : "transparent")};
        background-color: ${({ isToggled, theme }) => (isToggled ? theme.colors.inDepoNeutrals[4] : "transparent")};
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
`;

export const StyledRoundedControlInRed = styled(StyledRoundedControl)`
    &,
    &:focus {
        background-color: ${({ theme }) => theme.colors.inDepoRed[5]};
    }

    &:hover {
        background-color: ${({ theme }) => theme.colors.inDepoRed[4]};
    }

    &:active {
        background-color: ${({ theme }) => theme.colors.inDepoRed[6]};
    }
`;
