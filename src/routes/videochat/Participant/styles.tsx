import styled from "styled-components";
import spacing from "../../../constants/styles/spacing";
import { getPX, getREM } from "../../../constants/styles/utils";

export const StyledParticipantMask = styled.div`
    border-radius: ${({ theme }) => getPX(theme.default.borderRadiusBase, spacing.baseUnit)};
    overflow: hidden;
    height: 100%;
    background: ${({ theme }) => theme.colors.neutrals[0]};

    video {
        height: 100%;
        max-width: 100%;
    }
`;

export const StyledIdentityBox = styled.div`
    position: absolute;
    bottom: 12px;
    left: 15px;
    font-size: ${({ theme }) => getREM(theme.default.fontSizes[8])};
    color: ${({ theme }) => theme.colors.neutrals[5]};
    display: flex;
    flex-direction: column;
`;
