import styled from "styled-components";
import { getPX, getREM, hexToRGBA } from "../../constants/styles/utils";

export const RoughDraftDetailDepoPill = styled.div`
    color: ${({ theme }) => theme.default.whiteColor};
    text-align: center;
    font-size: 0.625rem;
    text-transform: uppercase;
    background-color: ${({ theme }) => hexToRGBA(theme.colors.inDepoRed[6], 0.6)};
    padding: ${({ theme }) => `${getREM(theme.default.spaces[3])} ${getREM(theme.default.spaces[4])}`};
    border-radius: ${({ theme }) => getPX(theme.default.borderRadiusBase, theme.default.baseUnit)};
    line-height: 1;
    flex: 1 0 auto;
`;

export const DashedLine = styled.div<{ side: string }>`
    border-top: dashed 1px gray;
    margin: ${({ side }) => `auto ${side === "left" ? "auto" : 0} auto ${side === "right" ? "auto" : 0}`};
    flex: 0 1 auto;
    width: 25%;
`;

export const RealTimeContainer = styled.div`
    height: 390px;
`;
