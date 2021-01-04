import styled from "styled-components";
import spacing from "../../../constants/styles/spacing";
import { getPX, getREM } from "../../../constants/styles/utils";

export const StyledParticipantMask = styled.div`
    border-radius: ${({ theme }) => getPX(theme.default.borderRadiusBase, spacing.baseUnit)};
    overflow: hidden;
    transform: translateZ(0); // Fix Safari stacking context problem
    width: 100%;
    height: 100%;
    background: ${({ theme }) => theme.colors.neutrals[0]};
    position: relative;

    img {
        height: 100%;
        max-width: 100%;
    }

    video {
        position: absolute;
        top: 0;
        left: 0;
        width: 115%;
        height: 115%;
        margin: -5%;
    }

    &:before {
        width: 100%;
        content: "";
        height: 15%;
        background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0) 0%,
            rgba(0, 0, 0, 0.05) 20%,
            rgba(0, 0, 0, 0.1) 40%,
            rgba(0, 0, 0, 0.2) 60%,
            rgba(0, 0, 0, 0.3) 80%,
            rgba(0, 0, 0, 0.5) 100%
        );
        position: absolute;
        bottom: 0;
        left: 0;
    }
`;

export const StyledIdentityBox = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    font-size: ${({ theme }) => getREM(theme.default.fontSizes[6])};
    padding: ${({ theme }) =>
        `${getREM(theme.default.spaces[12])} ${getREM(theme.default.spaces[4])} ${getREM(
            theme.default.spaces[7] / 2
        )}`};
    display: flex;
    flex-direction: column;
    max-width: 100%;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 100%);
    text-shadow: 0px 0px 2px rgba(0, 0, 0, 0.3), 0px 0px 8px rgba(0, 0, 0, 0.5);
    right: 0;
`;

export const StyledTimeBox = styled.div`
    text-transform: uppercase;
    position: absolute;
    font-size: ${({ theme }) => getREM(theme.default.fontSizes[6])};
    top: 0;
    right: 0;
    left: 0;
    padding: ${({ theme }) =>
        `
        ${getREM(theme.default.spaces[7] / 2)}
        ${getREM(theme.default.spaces[4])} 
        ${getREM(theme.default.spaces[12])} 
        `};
    display: flex;
    flex-direction: column;
    text-align: right;
    max-width: 100%;
    background: linear-gradient(0, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 100%);
    text-shadow: 0px 0px 2px rgba(0, 0, 0, 0.3), 0px 0px 8px rgba(0, 0, 0, 0.5);
`;
