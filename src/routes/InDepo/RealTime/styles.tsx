import { Space } from "antd";
import styled from "styled-components";
import { getREM, getPX, hexToRGBA } from "../../../constants/styles/utils";

export const StyledRealTimeContainer = styled.div`
    height: 100%;
    padding: ${({ theme }) => `${getREM(theme.default.spaces[1])}`};
    background: ${({ theme }) => theme.default.whiteColor};

    > * {
        height: 100%;
        overflow-y: auto;
        padding: ${({ theme }) => `${getREM(theme.default.spaces[7])}`};
        scrollbar-color: ${({ theme }) => `${theme.colors.inDepoBlue[6]} ${theme.default.disabledBg}`};
        scrollbar-width: thin;
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
            padding-bottom: ${({ theme }) => `${getREM(theme.default.spaces[5])}`};
            margin-bottom: ${({ theme }) => `${getREM(theme.default.spaces[5])}`};
            border-bottom: ${({ theme }) => `1px dashed ${theme.colors.inDepoBlue[2]}`};
        }
    }
`;

export const RealTimeHeader = styled.div`
    text-align: center;
    padding: ${({ theme }) => `${getREM(theme.default.spaces[3] * 4)} 0`};
`;

export const RoughDraftContainer = styled.div`
    width: fit-content;
    color: ${({ theme }) => theme.default.whiteColor};
    text-align: center;
    font-size: ${({ theme }) => getPX(theme.default.fontSizes[8], theme.default.baseUnit)};
    font-family: ${({ theme }) => theme.default.codeFontFamily};
    text-transform: uppercase;
    background-color: ${({ theme }) => hexToRGBA(theme.colors.inDepoBlue[6], 0.5)};
    padding: ${({ theme }) => `${getREM(theme.default.spaces[2] / 2)} ${getREM(theme.default.spaces[2])}`};
    margin: ${({ theme }) => `${getREM(theme.default.spaces[8])} auto ${getREM(theme.default.spaces[5])}`};
    border-radius: ${({ theme }) => getPX(theme.default.borderRadiusBase, theme.default.baseUnit)};
`;

export const TranscriptionsContainer = styled(Space)`
    width: 100%;
`;
