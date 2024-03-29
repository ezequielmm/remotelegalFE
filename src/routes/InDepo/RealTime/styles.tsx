import styled from "styled-components";
import Space from "@rl/prp-components-library/src/components/Space";
import { VariableSizeList as RealTimeContainer } from "react-window";
import { getPX, getREM, hexToRGBA } from "../../../constants/styles/utils";

export const StyledRealTimeContainer = styled(RealTimeContainer)`
    height: 100%;
    padding: ${({ theme }) => `${getREM(theme.default.spaces[1])}`};
    background: ${({ theme }) => theme.default.whiteColor};
    &::-webkit-scrollbar {
        width: ${({ theme }) => getPX(theme.default.spaces[2])};
    }
    &::-webkit-scrollbar-track {
        background-color: ${({ theme }) => theme.default.disabledBg};
    }
    &::-webkit-scrollbar-thumb {
        border-radius: ${({ theme }) => getPX(theme.default.spaces[5])};
        background: ${({ theme }) => theme.colors.inDepoBlue[6]};
    }

    & > :not(:last-child) {
        margin-bottom: ${({ theme }) => `${getREM(theme.default.spaces[6])}`};
        border-bottom: ${({ theme }) => `1px dashed ${theme.colors.inDepoBlue[2]}`};
    }
`;

export const HiddenRef = styled.span`
    display: none;
`;

export const RoughDraftPill = styled.div`
    width: fit-content;
    color: ${({ theme }) => theme.default.whiteColor};
    text-align: center;
    font-size: ${({ theme }) => getPX(theme.default.fontSizes[8], theme.default.baseUnit)};
    font-family: ${({ theme }) => theme.default.codeFontFamily};
    text-transform: uppercase;
    background-color: ${({ theme }) => hexToRGBA(theme.colors.inDepoBlue[6], 0.5)};
    padding: ${({ theme }) => `${getREM(theme.default.spaces[3])} ${getREM(theme.default.spaces[4])}`};
    margin: ${({ theme }) => `${getREM(theme.default.spaces[12])} auto`};
    border-radius: ${({ theme }) => getPX(theme.default.borderRadiusBase, theme.default.baseUnit)};
`;

export const TranscriptionsContainer = styled(Space)`
    width: 100%;
`;

export const StyledRealTimeInner = styled.div`
    padding: 0 ${({ theme }) => `${getREM(theme.default.spaces[8])}`};
`;
