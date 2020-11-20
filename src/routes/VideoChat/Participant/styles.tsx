import styled from "styled-components";
import spacing from "../../../constants/styles/spacing";
import { getPX, getREM } from "../../../constants/styles/utils";

export const StyledParticipantMask = styled.div`
    border-radius: ${({ theme }) => getPX(theme.default.borderRadiusBase, spacing.baseUnit)};
    overflow: hidden;
    height: 100%;
    background: ${({ theme }) => theme.colors.neutrals[0]};
    position: relative;
    video,
    img {
        height: 100%;
        max-width: 100%;
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
    padding: ${({ theme }) => `${getREM(theme.default.spaces[4] / 2)} ${getREM(theme.default.spaces[5] / 2)}`};
    display: flex;
    flex-direction: column;
    max-width: 100%;
`;
