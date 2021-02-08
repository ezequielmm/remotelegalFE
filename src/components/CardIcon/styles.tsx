import React from "react";
import styled from "styled-components";
import Card from "../Card";
import { StyledCard } from "../Card/Card";
import { getPX, getREM } from "../../constants/styles/utils";
import Button from "../Button";
import { ICardIconProps } from "./CardIcon";

export interface IStyledCardIconProps extends Omit<ICardIconProps, "icon"> {
    hasAction: boolean;
}

const defaultCard = ({ to, children, ...cardProps }: Omit<ICardIconProps, "icon">) => {
    return <Card {...cardProps}>{children}</Card>;
};

export const StyledCardIcon = styled(defaultCard)<IStyledCardIconProps>`
    ${({ hasAction, hasShaddow, theme }) => {
        const { spaces, primaryColor } = theme.default;

        const shaddowStyles = hasShaddow
            ? `
                transition: box-shadow 300ms ease;
                &:hover {
                    box-shadow: 0 ${getREM(spaces[9])} ${getREM(spaces[6])} -${getREM(spaces[6])} rgba(0, 0, 0, 0.08);
                }
            `
            : "";

        const linkStyles = hasAction
            ? `
                &:hover {
                    cursor: pointer;
                    .card-icon__action {
                        color: ${primaryColor};
                    }
                }
            `
            : "";

        return `
            ${StyledCard}&& {
                padding: ${getREM(spaces[6])};
                ${shaddowStyles}
                ${linkStyles}
            }
        `;
    }}
`;

export const StyledIconWrapper = styled.div`
    ${({ theme }) => {
        const { spaces, whiteColor, primaryColor, borderRadiusBase } = theme.default;

        return `
            color: ${whiteColor};
            background-color: ${primaryColor};
            border-radius: ${getPX(borderRadiusBase)};
            padding: ${getREM(spaces[6])};

            .anticon {
                display: block;
            }
        `;
    }}
`;

export const StyledButton = styled(Button)`
    text-align: initial;
    border: unset;
`;
